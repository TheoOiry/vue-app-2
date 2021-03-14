<template>
    <div class="game" v-if="game">
        <div v-if="!gameIsEnd" class="main_game">
            <div class="wikiTitles">
                <span class="wikiTitles_title">Titres Wikipedia</span>
                <div class="wikiTitles_container">
                    <button @click="reloadIframeUrl(wikiTitle.link)" class="wikiTitles_unit" v-for="wikiTitle in wikiTitles">
                        <span>{{ wikiTitle.title }}</span>
                    </button>
                </div>
            </div>
            <div class="wiki__page">
                <iframe class="iframe" id="ifr" :src="iFrameLink"></iframe>
                <button class="resolve_button"
                        v-if="game.page_end === this.wikiTitles[this.wikiTitles.length - 1].title && resolving !== null"
                        @click="resolve()"
                        :disabled="resolving === true"
                >Resolve
                </button>
            </div>
            <div class="players">
                <span class="players_title">Joueurs</span>
                <div class="players_container">
                    <UserInfo class="players_unit" v-for="user in getUsersWithPlace" :key="user.uuid" :user="user"/>
                </div>
            </div>
        </div>
        <div v-else>
            {{ getUsersWithPlace[0].username }} have win!
            <ul>
                <li v-for="user in getUsersWithPlace" :key="user">
                    <div v-if="user.place">
                        #{{ user.place }} - {{ user.username }}, time: {{ Math.floor(user.resolve_time / 60) }}:{{ Math.floor(user.resolve_time % 60) }}
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import UserInfo from "@/components/UserInfo";

export default {
    name: "Game",
    components: {UserInfo},
    props: {
        game_id: {
            type: String,
            default: undefined
        }
    },
    data: function () {
        return {
            game: undefined,
            wikiTitles: [],
            resolving: false,
            iFrameLink: "",
            gameIsEnd: false
        }
    },
    created: function () {
        const requestOptions = {
            method: "GET",
            headers: this.$store.getters.auth_full_header
        }
        const self = this
        fetch(`${this.$base_url}/get_game`, requestOptions)
            .then(res => res.json())
            .then(res => {
                if (res.message)
                    console.log(res.message)

                self.game = res.game
                self.wikiTitles.push({title: self.game.page_start, link: self.game.url_start})
                self.iFrameLink = self.game.url_start
                alert("Objectif:" + self.game.page_end)
                console.log(self.game.url_start)
            })
            .catch(err => console.log(err))

        window.addEventListener('message', event => {
            if (event.origin.startsWith(`http://localhost:8000`)) {
                this.updateWikiTitles(event)
                console.log(`NEW = ${event.data.new_page.title}`)
                console.log(`LAST = ${event.data.last_page.title}`)
            }
        })
        this.$store.state.connection.onmessage = function(e) {
            const data = JSON.parse(e.data)
            if(data.event === "user_resolve") {
                const user_resolved = data.data
                self.game.users = self.game.users.map(function (user) {
                    return user_resolved.uuid === user.uuid ? user_resolved : user
                })
                if(!self.game.users.find(el => !el.resolve_time)) {
                    self.gameIsEnd = true
                }
            }
        }
    },
    comments: {
        UserInfo
    },
    computed:{
        getUsersWithPlace: function (){
            if(!this.game)
                return []
            return [...this.game.users].sort(function (userA, userB) {
                const vUserA = userA.resolve_time === null ? Number.MAX_SAFE_INTEGER : userA.resolve_time
                const vUserB = userB.resolve_time === null ? Number.MAX_SAFE_INTEGER : userB.resolve_time

                return vUserA - vUserB
            })
            .map(function (user, index) {
                user.place = user.resolve_time === null ? undefined : index + 1
                return user
            })
        }
    },
    methods: {
        reloadIframeUrl: function (url) {
            this.iFrameLink = url
            document.querySelector("iframe").src = document.querySelector("iframe").src
        },
        updateWikiTitles: function (event) {
            if (event.data.last_page.title === this.wikiTitles[this.wikiTitles.length - 1].title) {
                this.wikiTitles.push(event.data.new_page)
            } else if (this.wikiTitles.find(w => w.title === event.data.last_page.title)) {
                while (this.wikiTitles.length > this.wikiTitles.indexOf(this.wikiTitles.find(w => w.title === event.data.last_page.title)) + 1) {
                    this.wikiTitles.pop() //
                }
                this.wikiTitles.push(event.data.new_page)
            } else {
                this.wikiTitles.push(event.data.new_page)
            }
        },
        resolve: function () {
            const titles = this.wikiTitles
                .filter(el => el.title !== this.game.page_start && el.title !== this.game.page_end)
                .map(el => el.title)
            const requestOptions = {
                method: "POST",
                headers: this.$store.getters.auth_full_header,
                body: JSON.stringify({ 'data': titles})
            }
            this.resolving = true
            const self = this
            fetch(`${this.$base_url}/resolve_path`, requestOptions)
                .then(function (res) {
                    self.resolving = res.status !== 200 ? false : null
                })
                .catch(err => console.log(err))
        }
    }
}
</script>

<style scoped lang="scss">

@import '../script'; // Using this should get you the variables

.main_game {
    display: flex;
    align-items: center;
    width: 99vw;
    height: 95vh;
    flex-direction: row;
    justify-content: space-around;
}

.players,
.wikiTitles {
    display: flex;
    flex-direction: column;
    //justify-content: space-between;
    padding-top: 2%;
    align-items: center;
    width: 27vh;
    height: 75vh;
    background: rgba(red($dark-grey), green($dark-grey), blue($dark-grey), 0.9);
    font-weight: 700;
    font-size: 1vw;
    font-family: Roboto, sans-serif;
}

.players {
    border-radius: 20px 50px 50px 20px;
}

.wikiTitles {
    border-radius: 50px 20px 20px 50px;
}

.players_title,
.wikiTitles_title {
    margin-top: 1vh;
    margin-bottom: 3vh;
    font-size: 1.5em;
    color: $white;
}

.players_container,
.wikiTitles_container {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 70%;
    height: 100%;
    margin-top: 3%;
    margin-bottom: 3%;
    overflow: auto;
}

.players_unit,
.wikiTitles_unit {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 5%;
    height: 30px;
    width: 100%;
    border-radius: 30px;
    background-color: $white;
    color: black;
    border: 0;
    font-weight: bold;
}

.iframe {
    width: 65vw;
    height: 85vh;
    //height: 900em;
    box-shadow: 1px 1px 15px 2.5px $dark-grey;
    border-radius: 10px;
    border: 10px;
}

.resolve_button {
    font-weight: 700;
    font-size: 1.6em;
    font-family: Roboto, sans-serif;
    border-radius: 6.25em;
    border: 0;
    box-shadow: 0 0.125em 0.3125em rgba($black, 0.3);
    padding: 0.1em 0.714em;
    margin-top: 20px;
    background-color: #42b983;
    color: $white;

    &:hover {
        transform: scale(1.15);
    }

    &:disabled {
        background-color: gray;
    }
}

</style>

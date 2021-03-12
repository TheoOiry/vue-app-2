<template>
  <div class="login">
    <div class="logo_container">
      <img alt="logo" class="logo" src="../assets/wikiwars_logo.png">
    </div>
    <div class="input">
      <input class="c-checkbox" type="checkbox" id="checkbox">
      <div class="c-formContainer">
        <div class="c-form">
          <input class="c-form__input" placeholder="Username" type="text" @keyup.enter="valid_username()" v-model="username" required>
          <label class="c-form__buttonLabel" for="checkbox">
            <button class="c-form__button" @click="valid_username()" type="button">Start</button>
          </label>
          <label class="c-form__toggle" for="checkbox" data-title="Play"></label>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data: function() {
    return {
      username: ""
    }
  },
  methods: {
    valid_username: async function() {
      const requestOptions = {
        method: 'POST',
        body: new URLSearchParams(`username=${this.username}`)
      };
      const self = this;
      fetch(`${this.$base_url}/login`, requestOptions)
          .then(res => res.json())
          .then(res => {
            if(res.message)
              console.log(res.message)

            // Store token with Vuex.Store
            self.$store.commit('setToken', res.token)
            self.$store.commit('setUUID', res.uuid)
            self.$store.state.connection.send(JSON.stringify({event:'user_assignation', token: self.$store.state.token}))
            self.$emit('onLogin')
          })
          .catch(err => console.log(err))
    }
  }
}
</script>

<style scoped lang="scss">
$black: #000000;
$cornflower-lilac: #323232;
$salmon: #221f1f;
$white: #ffffff;
$your-pink: #bcbcbc;

.logo_container {
  display: flex;
  margin: 20px 0 0 20px;
}

.logo {
  width: 100px;
  height: 100px;
}

.input {
  font-size: 10px; // change value to scale
  font-family: Roboto, sans-serif;
  margin: 0;
  display: grid;
  height: 72vh;
  place-items: center;
}

.c-checkbox {
  display: none;

  &:checked + .c-formContainer {
    .c-form {
      width: 37.5em;
    }

    .c-form__toggle {
      visibility: hidden;
      opacity: 0;
      transform: scale(0.7);
    }

    .c-form__input,
    .c-form__buttonLabel {
      transition: 0.2s 0.1s;
      visibility: visible;
      opacity: 1;
      transform: scale(1);
    }
  }

  &:not(:checked) + .c-formContainer {
    .c-form__input:required:valid ~ .c-form__toggle {
      cursor: default;
    }
  }
}

.c-formContainer,
.c-form,
.c-form__toggle {
  width: 20em;
  height: 6.25em;
}

.c-formContainer {
  position: relative;
  font-weight: 700;
}

.c-form,
.c-form__toggle {
  position: absolute;
  border-radius: 6.25em;
  background-color: $cornflower-lilac;
  transition: 0.2s;
}

.c-form {
  left: 50%;
  transform: translateX(-50%);
  padding: 0.625em;
  box-sizing: border-box;
  box-shadow: 0 0.125em 0.3125em rgba($black, 0.3);

  // position form inputs
  display: flex;
  justify-content: center;
}

.c-form__toggle {
  color: $white;
  top: 0;
  cursor: pointer;
  z-index: 1;

  // position message
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    font-size: 1.75em;
    content: attr(data-title);
  }
}

.c-form__input,
.c-form__button {
  font: inherit;
  border: 0;
  outline: 0;
  border-radius: 5em;
  box-sizing: border-box;
}

.c-form__input,
.c-form__buttonLabel {
  font-size: 1.75em;
  opacity: 0;
  visibility: hidden;
  transform: scale(0.7);
  transition: 0s;
}

.c-form__input {
  color: $white;
  background: $cornflower-lilac;
  height: 100%;
  width: 100%;
  padding: 0 0.714em;

  &::placeholder {
    color: currentColor;
  }

  &:required:valid {
    color: $white;

    + .c-form__buttonLabel {
      color: $cornflower-lilac;

      //&::before {
      //   pointer-events: inherit;
      //}
    }
  }
}

.c-form__buttonLabel {
  color: $cornflower-lilac;
  height: 100%;
  width: auto;

  // accepts click events
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    pointer-events: none;
    cursor: pointer;
  }
}

.c-form__button {
  color: inherit;
  padding: 0;
  height: 100%;
  width: 5em;
  background-color: $white;
  &:hover {
    cursor: pointer;
  }
}
</style>

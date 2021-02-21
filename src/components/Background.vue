<template>
  <div class="letters">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 500" preserveAspectRatio="xMidYMax slice">
      <g fill="#000000" fill-opacity=".6" transform="translate(55 42)">
        <g id="letters-bottom-layer">
          <text :x="randomNumber(-60,1020)" :y="randomNumber(6,1459)" v-for="n in 500" :key="`${n}bottom`" font-size="6">{{letters[Math.floor(Math.random()*letters.length)]}}</text>
        </g>
      </g>
      <g fill="#000000" fill-opacity=".6" transform="translate(65 63)">
        <g id="letters-top-layer">
          <text :x="randomNumber(-60,1020)" :y="randomNumber(8,1305)" v-for="n in 300" :key="`${n}top`" font-size="8">{{letters[Math.floor(Math.random()*letters.length)]}}</text>
        </g>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: "Background",
  data: function () {
    return {
      letters: ['M', 'T', 'W', 'A', 'P', 'R', 'T', 'Ï', 'Ý', 'ß', 'ñ', 'ę', 'Ď', 'Ķ', 'Ō', 'Ƒ', 'ƍ', 'Ʃ', 'Ʊ', 'Ǣ', 'ϴ', '传', '会', '字', '旧', '医', 'Ƴ', 'Δ', 'Ϣ', 'Ȕ', 'Ç', 'ŕ', 'Ɯ']
    }
  },
  methods: {
    randomNumber : function(min, max){
      return Math.random() * (max - min) + min;
    }
  }
}
</script>

<style scoped>
.letters {
  z-index: -1;
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.letters .svg {
  position: absolute;
  width: 100%;
  height: 100%;
}

#letters-top-layer {
  will-change: transform;
  transform: translateY(-768px);
  animation: fall 22.5s infinite linear;
}

#letters-bottom-layer {
  will-change: transform;
  transform: translateY(-768px);
  animation: fall 45s infinite linear;
}

@keyframes fall {
  100% {
    transform: translateY(0);
  }
}
</style>
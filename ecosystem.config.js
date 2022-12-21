module.exports = {
  apps: [{
    name: "TMM-Ukraine",
    script: "./main.js",
    watch: ["server"],
    watch_delay: 200,
    ignore_watch: ["node_modules", "music", "adv", "croxydb"]
  }
  ]
}

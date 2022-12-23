module.exports = {
  apps: [{
    name: "TMM",
    script: "./main.js",
    watch: ["server"],
    watch_delay: 200,
    ignore_watch: ["node_modules", "music", "adv", "croxydb"]
  }
  ]
}

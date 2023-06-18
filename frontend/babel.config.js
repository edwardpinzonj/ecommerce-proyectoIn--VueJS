// module.exports = {
//   presets: ["@vue/cli-plugin-babel/preset"],
// };

module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "@vue/babel-plugin-jsx",
      {
        isCustomElement: (tag) => tag === "vue-panzoom",
      },
    ],
  ],
};

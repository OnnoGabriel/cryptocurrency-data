exports.config = {
  bundles: [
    { components: ['cryptocurrency-data'] }
  ]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}

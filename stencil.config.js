exports.config = {
  namespace: 'cryptocurrency-data',
  generateDistribution: true,
  generateWWW: false,
  bundles: [
    { components: ['cryptocurrency-data'] }
  ],
  collections: [{ name: '@stencil/router' }]
};

exports.devServer = {
  root: 'www',
  watchGlob: '**/**'
}
HQvpyND77t8fYZDF6yVD

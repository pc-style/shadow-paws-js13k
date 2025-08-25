module.exports = {
  preset: [
    'advanced',
    {
      discardComments: {
        removeAll: true,
      },
      normalizeWhitespace: {
        exclude: false,
      },
      colormin: true,
      convertValues: {
        length: true,
        angle: true,
        time: true,
      },
      discardDuplicates: true,
      discardEmpty: true,
      discardOverridden: true,
      discardUnused: {
        fontFace: true,
        counterStyle: true,
        keyframes: true,
        namespace: true,
      },
      mergeIdents: true,
      mergeLonghand: true,
      mergeRules: true,
      minifyFontValues: true,
      minifyGradients: true,
      minifyParams: true,
      minifySelectors: true,
      normalizeCharset: true,
      normalizeDisplayValues: true,
      normalizePositions: true,
      normalizeRepeatStyle: true,
      normalizeString: true,
      normalizeTimingFunctions: true,
      normalizeUnicode: true,
      normalizeUrl: true,
      orderedValues: true,
      reduceIdents: {
        keyframes: true,
        counterStyle: true,
      },
      reduceInitial: true,
      reduceTransforms: true,
      svgo: {
        encode: true,
        plugins: [
          {
            name: 'preset-default',
            params: {
              overrides: {
                removeViewBox: false,
              },
            },
          },
        ],
      },
      uniqueSelectors: true,
      zindex: false, // Keep z-index values as they might be important for game layers
    },
  ],
};
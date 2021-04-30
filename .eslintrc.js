module.exports =
{
    'env': {
        'browser': true,
        'commonjs': true,
        'es6': true,
        'node': true,
        'jquery': true
    },
    'extends': 'eslint:recommended',
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly',
    },
    'parserOptions': {
        'ecmaVersion': 2018,
    },

    'ignorePatterns': ['src/assets/**/*.js'],
    'rules': {
        'quotes': [
            'error',
            'single',
        ],

        'semi': [
            'error',
            'never',
        ],
        'for-direction'
            : [
                'error',
            ],

        'no-dupe-else-if': [
            'error',
        ],

        'no-constant-condition': [
            'error',
        ],

        'no-empty': [ //no empty blocks
            'error',
        ],

        'block-scoped-var': [ //use var only in scope
            'error',
        ],

        'default-case': [
            'error',
        ],

        'default-param-last': [
            'error',
        ],
        'no-unused-vars':[
            'off',
        ],
    },
}
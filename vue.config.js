module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                // '@': resolve('src'),
                'assets': '@/assets',
                'common': '@/common',
                'components': '@/components',
                'network': '@/network',
                'views': '@/views',
            }
        }
    }
}
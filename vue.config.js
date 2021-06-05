module.exports = {
    configureWebpack: {
        resolve: {
            alias: {
                // 脚手架默认将src路径默认设为了@不用在自己写
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

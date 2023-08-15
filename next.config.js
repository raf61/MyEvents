/** @type {import('next').NextConfig} */
const nextConfig = {
    env:{
        "API_BASEURL": process.env.API_BASEURL,
        "BASEURL":process.env.BASEURL
    }
}

module.exports = nextConfig

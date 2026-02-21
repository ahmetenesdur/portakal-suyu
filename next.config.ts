import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.discordapp.com",
			},
			{
				protocol: "https",
				hostname: "discord.com",
			},
		],
	},
	cacheComponents: true,
	reactCompiler: true,
};

export default nextConfig;

module.exports = {
  apps: [
    {
      name: 'be',
      script: 'npm run start',
      env_production: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
};

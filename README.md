{
  "version": 2,
  "builds": [
    { "src": "api/**/*.js", "use": "@vercel/node" },
    { "src": "public/**/*", "use": "@vercel/static" }
  ]
}

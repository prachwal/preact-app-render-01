resource "render_static_site" "preact_app" {
  name = "preact-app-render-01"
  repo_url = "https://github.com/prachwal/preact-app-render-01"
  branch = "main"
  build_command = "npm run build"
  publish_path = "dist"
}

resource "render_web_service" "api" {
  name = "preact-app-api"
  plan = "starter"
  region = "oregon"
  start_command = "node api/index.js"
  runtime_source = {
    native_runtime = {
      runtime = "node"
      repo_url = "https://github.com/prachwal/preact-app-render-01"
      branch = "main"
      build_command = "npm install"
      root_directory = "api"
    }
  }
  env_vars = {
    NODE_ENV = {
      value = "production"
    }
  }
}
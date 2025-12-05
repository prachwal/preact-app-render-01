resource "render_static_site" "preact_app" {
  name = "preact-app-render-01"
  repo_url = "https://github.com/prachwal/preact-app-render-01"
  branch = "main"
  build_command = "npm run build"
  publish_path = "dist"
}
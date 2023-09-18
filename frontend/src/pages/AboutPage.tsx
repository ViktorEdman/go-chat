export default function AboutPage() {
  return (<>
    <p>
      Technologies used for this website:
    </p>

    <ul className="ml-8 list-disc">
      <li>Linux - the server is running Debian 12</li>
      <li>Go - the websocket and static content server is built with Go 1.21</li>
      <li>Typescript - Linting and discovability aid during development of the UI of the site.</li>
      <li>Preact - Using React semantics in a smaller bundle, I like my apps small and efficient.</li>
      <li>Docker - Using this to produce reproducible builds of the site, as well as gaining industry experience in infrastructure</li>
      <li>NGINX Proxy Manager - An off the shelf docker image for setting up a reverse proxy</li>
      <li>MariaDB - An off the shelf docker image for persisting the reverse proxy data between boots.</li>
      <li>Auto DNS Updater - A small go application i made for updating mycloudflare dns records if my dynamic IP changes.</li>
    </ul>
    <p>The source for the site can be found on Github <a className="text-blue-700 visited:text-purple-700" href="">here</a> </p>
  </>)
}

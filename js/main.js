let newServiceWorker;

if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registerEvent) => {
        registerEvent.addEventListener("updatefound", () => {
          newServiceWorker = registerEvent.installing;

          newServiceWorker.addEventListener("statechange", () => {
            /* if (newServiveWorker.state === 'installed') {

            } */

            switch (newServiceWorker.state) {
              case "installed":
                showSnackbarUpdate();
                break;
            }
          });
        });
      });
  });
}

function showSnackbarUpdate() {
  let x = document.getElementById("snackbar");

  x.className = "show";
}

let launchUpdate = document.getElementById("launchUpdate");
launchUpdate.addEventListener("click", () => {
  newServiceWorker.postMessage({
    action: "skipWaiting",
  });
  window.reload();
});

let d, $form, $loader, $err, $main, $artist, $error, $albums;

d = document;
($form = d.getElementById("artist-search")),
  ($loader = d.querySelector(".loader")),
  ($error = d.querySelector(".error")),
  ($main = d.querySelector("main")),
  ($artist = d.querySelector(".artist")),
  ($albums = d.querySelector(".albums"));

$form.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    $loader.style.display = "block";

    let artist = e.target.artist.value.toLowerCase(),
      $artistTemplate = "",
      artistApi = `https://theaudiodb.com/api/v1/json/1/search.php?s=${artist}`,
      artistFetch = fetch(artistApi),
      artistRes = await Promise.resolve(artistFetch),
      artistData = await artistRes.json();

    let artista = artistData.artists[0];

    console.log(artistData.artists);

    if (artistData.artist !== null) {
      $artistTemplate = `
                <div class='jumbotron jumbotron-fluid text-center'>
                <div class='container'>
                <h1 class='display-4'>${artista.strArtist}</h1>
                <div class='container-md'>
                <img class='container-fluid' src="${
                  artista.strArtistThumb
                }" alt="${artista.strArtist}">
                </div>
                <p class='lead'>
                    ${artista.intBornYear} - ${
        artista.intDiedYear || "Presente"
      }
                </p>
                <p class='lead'>
                    ${artista.strCountry}
                </p>
                <p>
                    ${artista.strGenre} - ${artista.strStyle}
                </p>
                <a class='lead' href="https://${
                  artista.strWebsite
                }" target="_blank" > Enlace a Sitio web <a/>
                <p class='lead'>
                    ${artista.strBiographyEN} 
                </p></div></div>
            `;
    } else {
      $artistTemplate = "<h2>Artista no encontrado en la bd</h2>";
    }

    let $albumTemplate = "",
      albumApi = `https://theaudiodb.com/api/v1/json/1/album.php?i=${artista.idArtist}`,
      albumFetch = fetch(albumApi),
      albumRes = await Promise.resolve(albumFetch),
      albumData = await albumRes.json();

    console.log(albumData.album);

    if (albumData.album !== null) {
      for (let i = 0; i < albumData.album.length; i++) {
        let album = albumData.album[i];
        $albumTemplate =
          $albumTemplate +
          `

          <div class="card border-success" style="width: 18rem;">
          <img class='card-img-top' src="${album.strAlbumThumb}" alt="${album.strAlbum}">
          <div class="card-body">
            <h5 class='card-title'>${album.strAlbum}</h5>
            <p class='card-text text-truncate'>
            ${album.strDescriptionEN} 
            </p>
          </div>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">Estilo: ${album.strStyle} - A&ntilde;o ${album.intYearReleased}</li>
            <li class="list-group-item">Genero: ${album.strGenre}</li>
            <li class="list-group-item">${album.strLabel} - ${album.strReleaseFormat}</li>
          </ul>
          <div class='card-body'>
            <a href="#" class="card-link">Ver mas</a>
          </div>
          </div>
          <hr>
          <br>
      `;
      }
    }

    $loader.style.display = "none";
    $artist.innerHTML = $artistTemplate;

    $albums.innerHTML = $albumTemplate;
  } catch (error) {
    console.log(error);
    let message = error.statusText || "Ocurrio un error";
    $error.innerHTML = `<p>Error ${error.status}: ${message}</p>`;
    $loader.style.display = "none";
  }
});

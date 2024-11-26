document.addEventListener('DOMContentLoaded', async () => {
    const albumList = document.getElementById('albums-list');
    const artistList = document.getElementById('artists-list');
    const genreList = document.getElementById('genres-list');
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');

    const albumArtistsSelect = document.getElementById('album-artists');
    const albumGenresSelect = document.getElementById('album-genres');
    const artistGenreSelect = document.getElementById('artist-genre');

    searchButton.addEventListener('click', performSearch);

    async function performSearch() {
        const query = searchBar.value.trim().toLowerCase();
        if (!query) {
            await displayAlbums();
            await displayArtists();
            await displayGenres();
            return;
        }

        // Realiza as buscas
        await searchAlbums(query);
        await searchArtists(query);
        await searchGenres(query);
    }

    async function searchAlbums(query) {
        try {
            const response = await fetch(`/api/search/albums?q=${query}`);
            console.log(`Albums search response status: ${response.status}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Albums data:', data);
                const albums = data.albums;
                albumList.innerHTML = '';
                albums.forEach(album => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                    ${album.cover ? `<img src="${album.cover}" alt="Album Cover" style="height: 100px;">` : ''}
                    <strong>${album.title}</strong> (${album.year})<br>
                    Artistas: ${album.artists.map(artist => artist.name).join(', ')}<br>
                    Faixas: ${album.tracks.map(track => track.title).join(', ')}<br>
                    Gêneros: ${album.genres.map(genre => genre.name).join(', ')}<br>
                    <button class="primary-button" onclick="updateAlbum(${album.id})">Editar</button>
                    <button class="primary-button" onclick="deleteAlbum(${album.id})">Excluir</button>
                `;
                    albumList.appendChild(li);
                });
            } else {
                console.error('Erro ao buscar álbuns:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar álbuns:', error);
        }
    }

    async function searchArtists(query) {
        try {
            const response = await fetch(`/api/search/artists?q=${query}`);
            console.log(`Artists search response status: ${response.status}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Artists data:', data);
                const artists = data.artists;
                artistList.innerHTML = '';
                artists.forEach(artist => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                    <strong>${artist.name}</strong> - Gêneros: ${artist.genres.map(genre => genre.name).join(', ')}<br>
                    <button class="primary-button" onclick="updateArtist(${artist.id})">Editar</button>
                    <button class="primary-button" onclick="deleteArtist(${artist.id})">Excluir</button>
                `;
                    artistList.appendChild(li);
                });
            } else {
                console.error('Erro ao buscar artistas:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar artistas:', error);
        }
    }

    async function searchGenres(query) {
        try {
            const response = await fetch(`/api/search/genres?q=${query}`);
            console.log(`Genres search response status: ${response.status}`);
            if (response.ok) {
                const data = await response.json();
                console.log('Genres data:', data);
                const genres = data.genres;
                genreList.innerHTML = '';
                genres.forEach(genre => {
                    const li = document.createElement('li');
                    li.innerHTML = `<strong>${genre.name}</strong>
                    <button class="primary-button" onclick="updateGenre(${genre.id})">Editar</button>
                    <button class="primary-button" onclick="deleteGenre(${genre.id})">Excluir</button>`;
                    genreList.appendChild(li);
                });
            } else {
                console.error('Erro ao buscar gêneros:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar gêneros:', error);
        }
    }

    async function displayAlbums() {
        try {
            const response = await fetch('/api/albums');
            if (response.ok) {
                const data = await response.json();
                const albums = data.albums;
                albumList.innerHTML = '';
                albums.forEach(album => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                    ${album.cover ? `<img src="${album.cover}" alt="Album Cover" style="height: 100px;">` : ''}
                    <strong>${album.title}</strong> (${album.year})<br>
                    Artistas: ${album.artists.map(artist => artist.name).join(', ')}<br>
                    Faixas: ${album.tracks.map(track => track.title).join(', ')}<br>
                    Gêneros: ${album.genres.map(genre => genre.name).join(', ')}<br>
                    <button class="primary-button" onclick="updateAlbum(${album.id})">Editar</button>
                    <button class="primary-button" onclick="deleteAlbum(${album.id})">Excluir</button>
                `;
                    albumList.appendChild(li);
                });
                await populateArtistsGenresSelects();
            } else {
                console.error('Erro ao listar álbuns:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao listar álbuns:', error);
        }
    }

    async function displayArtists() {
        try {
            const response = await fetch('/api/artists');
            if (response.ok) {
                const data = await response.json();
                const artists = data.artists || data;
                artistList.innerHTML = '';
                artists.forEach(artist => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                    <strong>${artist.name}</strong> - Gêneros: ${artist.genres.map(genre => genre.name).join(', ')}<br>
                    <button class="primary-button" onclick="updateArtist(${artist.id})">Editar</button>
                    <button class="primary-button" onclick="deleteArtist(${artist.id})">Excluir</button>
                `;
                    artistList.appendChild(li);
                });
                await populateArtistsGenresSelects();
            } else {
                console.error('Erro ao listar artistas:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao listar artistas:', error);
        }
    }

    async function displayGenres() {
        try {
            const response = await fetch('/api/genres');
            if (response.ok) {
                const genres = await response.json();
                genreList.innerHTML = '';
                genres.forEach(genre => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                    <strong>${genre.name}</strong>
                    <button class="primary-button" onclick="updateGenre(${genre.id})">Editar</button>
                    <button class="primary-button" onclick="deleteGenre(${genre.id})">Excluir</button>`;
                    genreList.appendChild(li);
                });
                await populateArtistsGenresSelects();
            } else {
                console.error('Erro ao listar gêneros:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao listar gêneros:', error);
        }
    }

    function populateSelect(selectElement, items) {
        selectElement.innerHTML = '';
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item.id;
            option.text = item.name;
            selectElement.appendChild(option);
        });
    }

    async function populateArtistsGenresSelects() {
        try {
            const [artistsResponse, genresResponse] = await Promise.all([
                fetch('/api/artists'),
                fetch('/api/genres')
            ]);

            const artistsData = await artistsResponse.json();
            const genresData = await genresResponse.json();

            const artists = artistsData.artists || artistsData;
            const genres = genresData.genres || genresData;

            populateSelect(albumArtistsSelect, artists);
            populateSelect(albumGenresSelect, genres);
            populateSelect(artistGenreSelect, genres);
        } catch (error) {
            console.error('Erro ao preencher campos de seleção:', error);
        }
    }

    const albumForm = document.getElementById('albumForm');
    albumForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(albumForm);
        const tracksArray = formData.get('tracks').split(',').map(track => {
            const [title, duration] = track.trim().split('|');
            return { title, duration: parseInt(duration, 10) || 0 };
        });
        formData.set('tracks', JSON.stringify(tracksArray));

        try {
            const response = await fetch('/api/albums', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                alert('Álbum criado com sucesso!');
                await displayAlbums();
            } else {
                const errorMessage = await response.json();
                alert('Erro ao criar álbum: ' + errorMessage.error);
            }
        } catch (error) {
            console.error('Erro ao criar álbum:', error);
            alert('Erro ao criar álbum');
        }

        albumForm.reset();
    });

    const artistForm = document.getElementById('artistForm');
    artistForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('artist-name').value;
        const genres = Array.from(document.getElementById('artist-genre').selectedOptions).map(option => option.value);
        const albums = Array.from(document.getElementById('artist-albums').selectedOptions).map(option => option.value);

        try {
            const response = await fetch('/api/artists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, genreIds: genres, albumIds: albums }),
            });

            if (response.ok) {
                alert('Artista criado com sucesso!');
                await displayArtists();
                await populateArtistsGenresSelects();
            } else {
                const errorMessage = await response.json();
                alert('Erro ao criar artista: ' + errorMessage.error);
            }
        } catch (error) {
            console.error('Erro ao criar artista:', error);
            alert('Erro ao criar artista');
        }

        artistForm.reset();
    });

    const genreForm = document.getElementById('genreForm');
    genreForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('genre-name').value;

        try {
            const response = await fetch('/api/genres', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });

            if (response.ok) {
                alert('Gênero criado com sucesso!');
                await displayGenres();
                await displayArtists();
                await populateArtistsGenresSelects();
            } else {
                alert('Erro ao criar gênero');
            }
        } catch (error) {
            console.error('Erro ao criar gênero:', error);
            alert('Erro ao criar gênero');
        }

        genreForm.reset();
    });

    await displayAlbums();
    await displayArtists();
    await displayGenres();
    await populateArtistsGenresSelects();
});

async function updateAlbum(id) {
    const newTitle = prompt('Digite o novo título do álbum:');
    const newYear = prompt('Digite o novo ano do álbum:');
    const newTracks = prompt('Digite as novas faixas no formato título|duração, separadas por vírgula:');
    const tracksArray = newTracks.split(',').map(track => {
        const [title, duration] = track.trim().split('|');
        return { title, duration: parseInt(duration, 10) || 0 };
    });

    const response = await fetch(`/api/albums/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, year: newYear, tracks: tracksArray, artists: [], genres: [] })
    });
    if (response.ok) {
        alert('Álbum atualizado com sucesso!');
        await displayAlbums();
    } else {
        alert('Erro ao atualizar álbum');
    }
}

async function deleteAlbum(id) {
    const response = await fetch(`/api/albums/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        alert('Álbum excluído com sucesso!');
        await displayAlbums();
    } else {
        alert('Erro ao excluir álbum');
    }
}

async function updateArtist(id) {
    const name = prompt('Digite o novo nome do artista:');
    const genreIds = prompt('Digite os IDs dos novos gêneros, separados por vírgula:', '').split(',').map(id => id.trim());

    const response = await fetch(`/api/artists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, genreIds })
    });

    if (response.ok) {
        alert('Artista atualizado com sucesso!');
        await displayArtists();
    } else {
        const errorMessage = await response.json();
        alert('Erro ao atualizar artista: ' + errorMessage.error);
    }
}

async function deleteArtist(id) {
    const response = await fetch(`/api/artists/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        alert('Artista excluído com sucesso!');
        await displayArtists();
    } else {
        alert('Erro ao excluir artista');
    }
}

async function updateGenre(id) {
    const newName = prompt('Digite o novo nome do gênero:');
    const response = await fetch(`/api/genres/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName })
    });
    if (response.ok) {
        alert('Gênero atualizado com sucesso!');
        await displayGenres();
    } else {
        alert('Erro ao atualizar gênero');
    }
}

async function deleteGenre(id) {
    const response = await fetch(`/api/genres/${id}`, {
        method: 'DELETE'
    });
    if (response.ok) {
        alert('Gênero excluído com sucesso!');
        await displayGenres();
    } else {
        alert('Erro ao excluir gênero');
    }
}
document.addEventListener('DOMContentLoaded', async () => {
    const albumList = document.getElementById('albums-list');
    const artistList = document.getElementById('artists-list');
    const genreList = document.getElementById('genres-list');
    const albumArtistsSelect = document.getElementById('album-artists');
    const albumGenresSelect = document.getElementById('album-genres');

    async function displayAlbums() {
        try {
            const response = await fetch('/api/albums');
            if (response.ok) {
                const albums = await response.json();
                const albumList = document.getElementById('albums-list');
                const albumArtistsSelect = document.getElementById('album-artists');
                const artistAlbumsSelect = document.getElementById('artist-albums'); // Novo

                albumList.innerHTML = '';
                albumArtistsSelect.innerHTML = '';
                artistAlbumsSelect.innerHTML = ''; // Limpa as opções de álbuns no formulário do artista

                albums.forEach(album => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                    <strong>${album.title}</strong> (${album.year})<br>
                    Artistas: ${album.artists.map(artist => artist.name).join(', ')}<br>
                    Faixas: ${album.tracks.map(track => track.title).join(', ')}<br>
                    Gêneros: ${album.genres.map(genre => genre.name).join(', ')}<br>
                    <button onclick="updateAlbum(${album.id})">Editar</button>
                    <button onclick="deleteAlbum(${album.id})">Excluir</button>
                `;
                    albumList.appendChild(li);

                    const artistOption = document.createElement('option'); // Novo
                    artistOption.value = album.id;
                    artistOption.text = album.title;
                    artistAlbumsSelect.appendChild(artistOption);

                    const albumOption = document.createElement('option');
                    albumOption.value = album.id;
                    albumOption.text = album.title;
                    albumArtistsSelect.appendChild(albumOption);
                });
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
                const artists = await response.json();
                artistList.innerHTML = '';
                albumArtistsSelect.innerHTML = '';
                artists.forEach(artist => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${artist.name}</strong> - Gênero: ${artist.genre}<br>
                        <button onclick="updateArtist(${artist.id})">Editar</button>
                        <button onclick="deleteArtist(${artist.id})">Excluir</button>
                    `;
                    artistList.appendChild(li);
                    const option = document.createElement('option');
                    option.value = artist.id;
                    option.text = artist.name;
                    albumArtistsSelect.appendChild(option);
                });
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
                const genreSelect = document.getElementById('artist-genre');
                genreSelect.innerHTML = '';
                genreList.innerHTML = '';
                albumGenresSelect.innerHTML = '';
                genres.forEach(genre => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${genre.name}</strong><br>
                        <button onclick="updateGenre(${genre.id})">Editar</button>
                        <button onclick="deleteGenre(${genre.id})">Excluir</button>
                    `;
                    genreList.appendChild(li);
                    const option = document.createElement('option');
                    option.value = genre.id;
                    option.text = genre.name;
                    albumGenresSelect.appendChild(option);
                });
            } else {
                console.error('Erro ao listar gêneros:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao listar gêneros:', error);
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
        formData.delete('cover');

        try {
            const response = await fetch('/api/albums', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(Object.fromEntries(formData))
            });

            if (response.ok) {
                alert('Álbum criado com sucesso!');
                await displayAlbums();
            } else {
                alert('Erro ao criar álbum');
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
        const genre = document.getElementById('artist-genre').value;
        const albums = Array.from(document.getElementById('artist-albums').selectedOptions).map(option => option.value);

        try {
            const response = await fetch('/api/artists', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, genre, albumIds: albums }),
            });

            if (response.ok) {
                alert('Artista criado com sucesso!');
                await displayArtists();
            } else {
                alert('Erro ao criar artista');
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
});

async function updateAlbum(id) {
    const newTitle = prompt('Digite o novo título do álbum:');
    const newYear = prompt('Digite o novo ano do álbum:');
    const response = await fetch(`/api/albums/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, year: newYear, tracks: '[]', artists: [], genres: [] })
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
    const newName = prompt('Digite o novo nome do artista:');
    const newGenre = prompt('Digite o novo gênero do artista:');
    const response = await fetch(`/api/artists/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName, genre: newGenre })
    });
    if (response.ok) {
        alert('Artista atualizado com sucesso!');
        await displayArtists();
    } else {
        alert('Erro ao atualizar artista');
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
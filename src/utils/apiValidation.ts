import { spotifyService } from '../services/spotifyAPI';

export const validateSpotifyAPI = async () => {
  console.log('🔍 Validando implementação da API do Spotify...');
  
  try {
    // 1. Testar endpoint de perfil
    console.log('1️⃣ Testando endpoint de perfil...');
    const profile = await spotifyService.getUserProfile();
    console.log('✅ Perfil OK:', profile.display_name);
    
    // 2. Testar endpoint de top tracks
    console.log('2️⃣ Testando endpoint de top tracks...');
    const topTracks = await spotifyService.getTopTracks('short_term', 5);
    console.log('✅ Top tracks OK:', topTracks.length, 'faixas');
    
    if (topTracks.length > 0) {
      // 3. Testar novo endpoint de audio features (uma faixa)
      console.log('3️⃣ Testando audio features (uma faixa)...');
      const singleFeature = await spotifyService.getAudioFeatures([topTracks[0].id]);
      console.log('✅ Audio features (1) OK:', singleFeature.length > 0 ? 'Sucesso' : 'Falha');
      
      if (topTracks.length >= 3) {
        // 4. Testar novo endpoint de audio features (múltiplas faixas)
        console.log('4️⃣ Testando audio features (múltiplas faixas)...');
        const trackIds = topTracks.slice(0, 3).map(track => track.id);
        const multipleFeatures = await spotifyService.getAudioFeatures(trackIds);
        console.log('✅ Audio features (múltiplas) OK:', multipleFeatures.length, '/', trackIds.length);
      }
    }
    
    // 5. Testar endpoint de playlists
    console.log('5️⃣ Testando endpoint de playlists...');
    const playlists = await spotifyService.getUserPlaylists(10);
    console.log('✅ Playlists OK:', playlists.length, 'playlists');
    
    console.log('🎉 Todos os testes passaram! API funcionando corretamente.');
    return true;
    
  } catch (error: any) {
    console.error('❌ Erro na validação:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url
    });
    return false;
  }
};

export const simulatePlaylistAnalysis = async (playlistId?: string) => {
  if (!playlistId) {
    console.log('⚠️ Simulação de análise requer um ID de playlist');
    return false;
  }
  
  try {
    console.log('🧪 Simulando análise de playlist:', playlistId);
    
    // 1. Buscar playlist
    console.log('1️⃣ Buscando playlist...');
    const playlist = await spotifyService.getPlaylist(playlistId);
    console.log('✅ Playlist encontrada:', playlist.name, `(${playlist.tracks.total} faixas)`);
    
    // 2. Extrair IDs das primeiras 20 faixas para teste
    const trackIds = playlist.tracks.items
      .slice(0, 20)
      .map(item => item.track?.id)
      .filter((id): id is string => !!id);
    
    if (trackIds.length === 0) {
      console.log('⚠️ Nenhuma faixa válida encontrada');
      return false;
    }
    
    console.log(`2️⃣ Analisando ${trackIds.length} faixas...`);
    
    // 3. Buscar audio features
    const startTime = Date.now();
    const audioFeatures = await spotifyService.getAudioFeatures(trackIds);
    const endTime = Date.now();
    
    console.log('✅ Análise concluída:', {
      faixasAnalisadas: audioFeatures.length,
      faixasTotal: trackIds.length,
      tempoDecorrido: `${endTime - startTime}ms`,
      taxaSucesso: `${((audioFeatures.length / trackIds.length) * 100).toFixed(1)}%`
    });
    
    return true;
    
  } catch (error: any) {
    console.error('❌ Erro na simulação:', {
      message: error.message,
      status: error.response?.status
    });
    return false;
  }
}; 
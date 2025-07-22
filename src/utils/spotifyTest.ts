import { spotifyService } from '../services/spotifyAPI';

export const testSpotifyConnection = async () => {
  try {
    console.log('🧪 Testando conexão com Spotify API...');
    
    // Testar busca do perfil do usuário
    console.log('1. Testando busca do perfil...');
    const profile = await spotifyService.getUserProfile();
    console.log('✅ Perfil obtido:', profile.display_name);
    
    // Testar busca de top tracks
    console.log('2. Testando busca de top tracks...');
    const topTracks = await spotifyService.getTopTracks('short_term', 1);
    if (topTracks.length > 0) {
      console.log('✅ Top tracks obtidas:', topTracks[0].name);
      
      // Testar busca de audio features para uma música
      console.log('3. Testando audio features...');
      const trackId = topTracks[0].id;
      const audioFeatures = await spotifyService.getSingleAudioFeatures(trackId);
      
      if (audioFeatures) {
        console.log('✅ Audio features obtidas:', {
          danceability: audioFeatures.danceability,
          energy: audioFeatures.energy,
          valence: audioFeatures.valence
        });
      } else {
        console.log('❌ Não foi possível obter audio features');
      }
    } else {
      console.log('❌ Nenhuma top track encontrada');
    }
    
    console.log('🎉 Teste concluído com sucesso!');
    return true;
  } catch (error: any) {
    console.error('❌ Erro no teste de conectividade:', {
      status: error.response?.status,
      message: error.response?.data?.error?.message || error.message,
      url: error.config?.url
    });
    return false;
  }
};

export const testSingleAudioFeature = async (trackId: string) => {
  try {
    console.log(`🎵 Testando audio feature para track: ${trackId}`);
    
    const token = window.localStorage.getItem('spotify_token');
    console.log('Token disponível:', !!token);
    
    if (token) {
      console.log('Token preview:', `${token.substring(0, 20)}...`);
    }
    
    const audioFeature = await spotifyService.getSingleAudioFeatures(trackId);
    
    if (audioFeature) {
      console.log('✅ Audio feature obtida com sucesso:', audioFeature);
      return audioFeature;
    } else {
      console.log('❌ Audio feature retornou null');
      return null;
    }
  } catch (error) {
    console.error('❌ Erro ao testar audio feature:', error);
    return null;
  }
}; 
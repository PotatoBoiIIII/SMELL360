<script>
  import maplibregl from 'maplibre-gl';
  import { onMount } from 'svelte';

  import 'maplibre-gl/dist/maplibre-gl.css';  
  let map;
  let mapContainer;

  onMount(() => {
    map = new maplibregl.Map({
      container: mapContainer, // container id or element
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=F7nv5KBARzvXCzTOadTH', // basic open style
      center: [0, 0], // starting position [lng, lat]
      zoom: 2 // starting zoom
    });
     map.on('click', (e) => {
      const { lng, lat } = e.lngLat;

      new maplibregl.Marker()
        .setLngLat([lng, lat])
        .addTo(map);
    });

    return () => {
      map.remove(); // cleanup on component destroy
    };
  });
  
</script>

<style>
  #map {
    width: 100%;
    height: 600px;
  }
  #maplibregl-marker {
  background-image: url('https://cdn.maptiler.com/maplibre-gl-js/v1.15.2/img/marker-icon.png');
  background-size: cover;
  width: 30px;
  height: 40px;
  cursor: pointer;
}

</style>

<div bind:this={mapContainer} id="map"></div>

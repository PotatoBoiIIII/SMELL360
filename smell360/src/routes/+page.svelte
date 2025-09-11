<script>
  import maplibregl from 'maplibre-gl';
  import { onMount } from 'svelte';
  import Modal from '../lib/Modal.svelte'
  import 'maplibre-gl/dist/maplibre-gl.css';  
  let map;
  let mapContainer;
  let modalOpen = $state(false);
  let showModal = $state(false)
  let modalContent = $state('');
  let markerColor = $state('#000000');

  function openModal(content,ide){
    showModal=!showModal;
    modalContent=content;
    id=ide;
  } 
  let markers = [
    {id:1, lng:100, lat:100},
    {id:2, lng:100, lat:100},
  ];
  let id = $state(0);
  onMount(() => {
    map = new maplibregl.Map({
      container: mapContainer, // container id or element
      style: 'https://api.maptiler.com/maps/streets-v2/style.json?key=F7nv5KBARzvXCzTOadTH', // basic open style
      center: [0, 0], // starting position [lng, lat]
      zoom: 2 // starting zoom
    });
     map.on('click', (e) => {
      const { lng, lat } = e.lngLat;

      const marker = new maplibregl.Marker({color:markerColor})
        .setLngLat([lng, lat])
        .addTo(map);
      markers.push({id:10,lng:lng,lat:lat})
      const markerElement = marker.getElement();
      markerElement.addEventListener('click', (event) => {
      event.stopPropagation();
      const content = `Marker at [${lng.toFixed(4)}, ${lat.toFixed(4)}]`;
      
      openModal(content, 1);
    });
    });

    return () => {
      map.remove(); // cleanup on component destroy
    };
  });
  
</script>
<Modal bind:showModal>
  {#snippet header()}
		<h2>
			{modalContent}
		</h2>
	{/snippet}

</Modal>
<button onclick={() => (markerColor="#00FFFF")}> blue </button>
<button onclick={() => (markerColor="#00000")}> black </button>
<button onclick={() => (markerColor="#FF0000")}> red </button>

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

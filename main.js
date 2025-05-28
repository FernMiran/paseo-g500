import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.167.1/build/three.module.js';

import { OrbitControls } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'https://cdn.jsdelivr.net/npm/three@0.167.1/examples/jsm/renderers/CSS2DRenderer.js';

const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

if (isTouchDevice) {
    console.log('Running on a touch device');
}

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(
    60, // Field of view (degrees)
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near clipping plane
    1000 // Far clipping plane
);
camera.position.set(0, 0, 0.1); // Small offset to avoid control issues

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // Enhance sharpness on high-DPI displays

renderer.outputColorSpace = THREE.SRGBColorSpace;

document.body.appendChild(renderer.domElement);

// … your WebGLRenderer setup …

// CSS2D renderer for labels
const labelRenderer = new CSS2DRenderer();
labelRenderer.setSize(window.innerWidth, window.innerHeight);
labelRenderer.domElement.style.position = 'absolute';
labelRenderer.domElement.style.top      = '0';
labelRenderer.domElement.style.pointerEvents = 'none'; // let clicks pass through
document.body.appendChild(labelRenderer.domElement);

// Create a cylindrical panorama
const radius = 500;
const widthSegments = 60;
const heightSegments = 40;

const geometry = new THREE.CylinderGeometry(
    radius, // top radius
    radius, // bottom radius
    radius * 1.2, // height (adjust based on your aspect ratio)
    widthSegments,
    heightSegments,
    true // open-ended cylinder
);

// Modify UVs to properly map the panoramic image
const uvAttribute = geometry.attributes.uv;
for (let i = 0; i < uvAttribute.count; i++) {
    let u = uvAttribute.getX(i);
    // Flip and adjust UVs for proper mapping
    uvAttribute.setX(i, 1 - u);
}

// Material with texture mapped to the inside
const material = new THREE.MeshBasicMaterial({
	side: THREE.BackSide
});

// Create and add mesh to the scene
const cylinder = new THREE.Mesh(geometry, material);
scene.add(cylinder);

// Create a group for hotspots and infospots
const hotspotsGroup = new THREE.Group();
const infospotsGroup = new THREE.Group();
const labelsGroup = new THREE.Group();

scene.add(hotspotsGroup);
scene.add(infospotsGroup);
scene.add(labelsGroup);

// Define panoramas with hotspots
const panoramas = [
    {
        id: 1,
        name: 'Plaza Mariana',
        image: './mapa/1.jpg',
        music: './audio/1.m4a',
        hotspots: [
            { position: { u: 0.4, v: 0.35 }, target: 22, label: 'Inicio' },
            { position: { u: 0.5, v: 0.35 }, target: 2 },
            { position: { u: 0.56, v: 0.35 }, target: 21 },
            { position: { u: 0.73, v: 0.35 }, target: 20 },
            { position: { u: 0.85, v: 0.35 }, target: 19 },
        ],
        infospots: [             
            { 
                position: { u: 0.3, v: 0.2 }, 
                image: [ './mapa/1/1a.jpg' ],
                video: '',
                title: 'Bienvenido al paseo virtual de la Básilica de Guadalupe', 
                description: 'Para navegar por el recorrido, utiliza el mouse o el touchpad. Haz clic en los puntos de interés para obtener más información.'
            }
        ]
    },
    {
        id: 2        ,
        name: 'Papa Juan Pablo II',
        image: './mapa/2.jpg',
        music: './audio/7.m4a', // './audio/14.m4a',
        hotspots: [
            { position: { u: 0.17, v: 0.4 }, target: 22 },
            { position: { u: 0.35, v: 0.4 }, target: 3 },
            { position: { u: 0.7, v: 0.4 }, target: 21 },
            { position: { u: 0.77, v: 0.45 }, target: 20 },
            { position: { u: 0.9, v: 0.45 }, target: 1 }

        ],
        infospots: [
            { 
                position: { u: 0.45, v: 0.4 }, 
                image: [ './mapa/2/2a.jpg', './mapa/2/2b.jpg'],
                video: '',
                title: '', 
                description: ''
            }
        ]
    },    
	{
        id: 3        ,
        name: 'Atrio Bautisterio',
        image: './mapa/3.jpg',
        music: './audio/3.m4a',
        hotspots: [
            { position: { u: 0.1, v: 0.4 }, target: 22 },
            { position: { u: 0.62, v: 0.4 }, target: 4},
            { position: { u: 0.82, v: 0.4 }, target: 21 },
            { position: { u: 0.9, v: 0.4 }, target: 2 }
        ],
        infospots: [
        ]
    },
    {
        id: 4        ,
        name: 'Lateral Bautisterio',
        image: './mapa/4.jpg',
        music: './audio0.mp3',
        hotspots: [
            { position: { u: 0.08, v: 0.3 }, target: 3 },
            { position: { u: 0.4, v: 0.2 }, target: 5 },
            { position: { u: 0.63, v: 0.4 }, target: 8 }
        ],
        infospots: [
        ]
    },
    {
        id: 5        ,
        name: 'Jardín Cristo Rey',
        image: './mapa/5.jpg',
        music: './audio/2.m4a',
        hotspots: [
            { position: { u: 0.38, v: 0.4 }, target: 6 },
            { position: { u: 0.77, v: 0.2 }, target: 4 }
        ],
        infospots: [
            {
                position: { u: 0.3, v: 0.3 }, 
                image: './mapa/5/5a.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.34, v: 0.35 }, 
                image: './mapa/5/5b.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.36, v: 0.4 }, 
                image: [ './mapa/5/5c.jpg', './mapa/5/5d.jpg', './mapa/5/5e.jpg', './mapa/5/5f.jpg' ],
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.4, v: 0.4 }, 
                image: [ './mapa/5/5g.jpg', './mapa/5/5h.jpg' ],
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.42, v: 0.35 }, 
                image: './mapa/5/5i.jpg',
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 6        ,
        name: 'Estatua Cristo Rey',
        image: './mapa/6.jpg',
        music: './audio/3a.m4a',
        hotspots: [
            { position: { u: 0.35, v: 0.3 }, target: 7 },
            { position: { u: 0.91, v: 0.2 }, target: 5 }
        ],
        infospots: [
            {
                position: { u: 0.6, v: 0.3 }, 
                image: [ './mapa/6/6a.jpg', './mapa/6/6b.jpg', './mapa/6/6c.jpg'],
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 7        ,
        name: 'Pasillo',
        image: './mapa/7.jpg',
        music: './audio0.mp3',
        hotspots: [
            { position: { u: 0.22, v: 0.7 }, target: 8 },
            { position: { u: 0.52, v: 0.3 }, target: 6 }
        ],
        infospots: [            
            {
                position: { u: 0.33, v: 0.7 }, 
                image: [ './mapa/6/6a.jpg', './mapa/6/6b.jpg', './mapa/6/6c.jpg'],
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 8        ,
        name: 'Escaleras',
        image: './mapa/8.jpg',
        music: './audio0.mp3',
        hotspots: [
            { position: { u: 0.1, v: 0.3 }, target: 7 },
            { position: { u: 0.58, v: 0.4 }, target: 9 },
            { position: { u: 0.87, v: 0.2 }, target: 4 },
        ],
        infospots: [
        ]
    },
    {
        id: 9        ,
        name: 'Fuente Tepeyac',
        image: './mapa/9.jpg',
        music: './audio/4.m4a',
        hotspots: [
            { position: { u: 0.1, v: 0.2 }, target: 8 },
            { position: { u: 0.32, v: 0.4 }, target: 10 },
        ],
        infospots: [
            {
                position: { u: 0.27, v: 0.4 },
                image: [ './mapa/9/9a.jpg', './mapa/9/9b.jpg'],
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.9, v: 0.3 },
                image: './mapa/9/9c.jpg',
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 10        ,
        name: 'Panteón del Tepeyac',
        image: './mapa/10.jpg',
        music: '',
        hotspots: [
            { position: { u: 0.47, v: 0.3 }, target: 9 },
            { position: { u: 0.8, v: 0.3 }, target: 11 }
        ],
        infospots: [
            {
                position: { u: 0.61, v: 0.6 },
                image: [ './mapa/10/10a.jpg', './mapa/10/10b.jpg'],
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 11        ,
        name: 'Escaleras Tepeyac',
        image: './mapa/11.jpg',
        music: './audio0.mp3',
        hotspots: [
            // { position: { u: 0.07, v: 0.3 }, target: 112 },
            { position: { u: 0.1, v: 0.3 }, target: 10 },
            { position: { u: 0.4, v: 0.6 }, target: 12 },
            { position: { u: 0.7, v: 0.3 }, target: 13 },
            { position: { u: 0.8, v: 0.3 }, target: 112 }
        ],
        infospots: [
        ]
    },
    {
        id: 12        ,
        name: 'Atrio Tepeyac',
        image: './mapa/12.jpg',
        music: './audio/5.m4a',
        hotspots: [
            { position: { u: 0.08, v: 0.2 }, target: 11 },
            { position: { u: 0.47, v: 0.4 }, target: 121 },
            { position: { u: 0.87, v: 0.2 }, target: 11 }
        ],
        infospots: [
            {
                position: { u: 0.1, v: 0.6 },
                image: [ './mapa/12/12a.jpg', './mapa/12/12b.jpg', './mapa/12/12c.jpg', './mapa/12/12d.jpg'],
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.75, v: 0.4 },
                image: '',
                video: './video/2.mp4',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.8, v: 0.4 },
                image: [ './mapa/12/12e.jpg' ],
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 13        ,
        name: 'Barco y Velero',
        image: './mapa/13.jpg',
        music: './audio/10.m4a',
        hotspots: [
            { position: { u: 0.13, v: 0.7 }, target: 11 },
            { position: { u: 0.65, v: 0.2 }, target: 14 }
        ],
        infospots: [
            {
                position: { u: 0.39, v: 0.3 },
                image: [ './mapa/13/13a.jpg', './mapa/13/13b.jpg'],
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 14        ,
        name: 'Fuentes de los Dragones',
        image: './mapa/14.jpg',
        music: './audio0.mp3',
        hotspots: [
            { position: { u: 0.08, v: 0.7 }, target: 13 },
            { position: { u: 0.38, v: 0.3 }, target: 15 }
        ],
        infospots: [
        ]
    },
    {
        id: 15        ,
        name: 'Pasillo de la Ofrenda',
        image: './mapa/15.jpg',
        music: './audio0.mp3',
        hotspots: [
            { position: { u: 0.1, v: 0.6 }, target: 14 },
            { position: { u: 0.55, v: 0.4 }, target: 16 }
        ],
        infospots: [
        ]
    },
    {
        id: 16        ,
        name: 'La Ofrenda',
        image: './mapa/16.jpg',
        music: './audio/11.m4a',
        hotspots: [
            { position: { u: 0.1, v: 0.3 }, target: 15 },
            { position: { u: 0.62, v: 0.6 }, target: 162 },
            { position: { u: 0.9, v: 0.6 }, target: 17 }
        ],
        infospots: [
            {
                position: { u: 0.37, v: 0.7 },
                image: [ './mapa/16/16a.jpg', './mapa/16/16b.jpg', './mapa/16/16c.jpg', './mapa/16/16d.jpg', './mapa/16/16e.jpg' ],
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 17        ,
        name: 'Pasillo Pocito',
        image: './mapa/17.jpg',
        music: './audio0.mp3',
        hotspots: [
            { position: { u: 0.12, v: 0.4 }, target: 18 },
            { position: { u: 0.75, v: 0.4 }, target: 16 }
        ],
        infospots: [
        ]
    },
    {
        id: 18        ,
        name: 'Atrio Pocito',
        image: './mapa/18.jpg',
        music: './audio/16.m4a', // Change to interior only (When pocito scene is added)
        hotspots: [
            { position: { u: 0.1, v: 0.3 }, target: 17 },
            { position: { u: 0.35, v: 0.3 }, target: 182 },
            { position: { u: 0.55, v: 0.3 }, target: 19 }
        ],
        infospots: [
            {
                position: { u: 0.62, v: 0.3 },
                image: [ './mapa/18/18a.jpg', './mapa/18/18b.jpg', './mapa/18/18c.jpg', './mapa/18/18d.jpg', './mapa/18/18f.jpg'],
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 19        ,
        name: 'Atrio Indios',
        image: './mapa/19.jpg',
        music: './audio/20.m4a',
        hotspots: [
            { position: { u: 0.27, v: 0.4 }, target: 0 },
            { position: { u: 0.72, v: 0.35 }, target: 192 },
            { position: { u: 0.89, v: 0.35 }, target: 18 }
        ],
        infospots: [
            {
                position: { u: 0.3, v: 0.4 },
                image: [ './mapa/19/19a.jpg', './mapa/19/19b.jpg', './mapa/19/19c.jpg', './mapa/19/19d.jpg', './mapa/19/19f.jpg'],
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 20        ,
        name: 'Parroquia de Santa María de Guadalupe',
        image: './mapa/20.jpg',
        music: './audio0.mp3',
        hotspots: [
            { position: { u: 0.9, v: 0.3 }, target: 1 }
        ],
        infospots: [
            {
                position: { u: 0.73, v: 0.3 },
                image: './mapa/20/20b.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.6, v: 0.7 },
                image: './mapa/20/20e.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.66, v: 0.4 },
                image: [ './mapa/20/20i.jpg', './mapa/20/20d.jpg', './mapa/20/20h.jpg' ],
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.72, v: 0.7 },
                image: './mapa/20/20c.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.5, v: 0.3 },
                image: './mapa/20/20g.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.57, v: 0.3 },
                image: './mapa/20/20f.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.1, v: 0.3 },
                image: './mapa/20/20j.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.37, v: 0.4 },
                image: './mapa/20/20a.jpg',
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 21        ,
        name: 'Antigua Básilica',
        image: './mapa/21.jpg',
        music: './audio/18.m4a',
        hotspots: [
            { position: { u: 0.1, v: 0.3 }, target: 3 },
            { position: { u: 0.9, v: 0.3 }, target: 1 }
        ],
        infospots: [
            {
                position: { u: 0.1, v: 0.6 },
                image: './mapa/21/21h.jpg' ,
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.18, v: 0.4 },
                image: [ './mapa/21/21a.jpg', './mapa/21/21b.jpg' ],
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.3, v: 0.8 },
                image: './mapa/21/21c.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.37, v: 0.4 },
                image: './mapa/21/21d.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.485, v: 0.4 },
                image: [ './mapa/21/21l.jpg', './mapa/21/21k.jpg', './mapa/21/21i.jpg', ],
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.78, v: 0.4 },
                image: [ './mapa/21/21f.jpg', './mapa/21/21g.jpg' ],
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 22        ,
        name: 'Nueva Básilica de Guadalupe',
        image: './mapa/22.jpg',
        music: './audio/6.m4a',
        hotspots: [
            { position: { u: 0.1, v: 0.2 }, target: 1 },
            { position: { u: 0.64, v: 0.25 }, target: 24 },
            { position: { u: 0.9, v: 0.2 }, target: 1 }
        ],
        infospots: [
            {
                position: { u: 0.2, v: 0.2 },
                image: [ './mapa/26/26a.jpg', './mapa/26/26b.jpg',  './mapa/26/26c.jpg',  ],
                video: '',
                title: '',
                description:  ''
            },            
            {
                position: { u: 0.27, v: 0.2 },
                image: './mapa/27/27a.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.475, v: 0.3 },
                image: './mapa/22/22a.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.67, v: 0.2 },
                image: './mapa/27/27b.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.8, v: 0.2 },
                image: [ './mapa/25/25a.jpg', './mapa/25/25b.jpg',  './mapa/25/25c.jpg',  ],
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 23        ,
        name: 'Bautisterio',
        image: './mapa/23.jpg',
        music: './audio/25.m4a',
        hotspots: [
            { position: { u: 0.1, v: 0.3 }, target: 1 }
        ],
        infospots: [
            {
                position: { u: 0.8, v: 0.3 },
                image: [ './mapa/23/23a.jpg', './mapa/23/23b.jpg', './mapa/23/23c.jpg'],
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 24        ,
        name: 'Tabernaculo',
        image: './mapa/24.jpg',
        music: './audio/26.m4a',
        hotspots: [
            { position: { u: 0.1, v: 0.3 }, target: 22 },
            { position: { u: 0.9, v: 0.3 }, target: 22 }
        ],
        infospots: [
            {
                position: { u: 0.425, v: 0.4 },
                image: [ './mapa/24/24a.jpg', './mapa/24/24b.jpg', './mapa/24/24c.jpg'],
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 112        ,
        name: 'Escalinatas Tepeyac',
        image: './mapa/112.jpg',
        music: './audio0.mp3',
        hotspots: [
            { position: { u: 0.3, v: 0.4 }, target: 10 },
            { position: { u: 0.6, v: 0.3 }, target: 13 }
        ],
        infospots: [
        ]
    },
    {
        id: 121        ,
        name: 'Capilla del Tepeyac',
        image: './mapa/121.jpg',
        music: './audio/15.m4a',
        hotspots: [
            { position: { u: 0.92, v: 0.3 }, target: 12 },
            { position: { u: 0.07, v: 0.3 }, target: 12 }
        ],
        infospots: [
            {
                position: { u: 0.3, v: 0.3 },
                image: [ './mapa/121/121a.jpg', './mapa/121/121b.jpg', './mapa/121/121e.jpg','./mapa/121/121f.jpg' ],
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.57, v: 0.4 },
                image: [  './mapa/121/121g.jpg', './mapa/121/121c.jpg' ],
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.57, v: 0.8 },
                image: [ './mapa/121/121r.jpg' ],
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.85, v: 0.4 },
                image: [ './mapa/121/121h.jpg', './mapa/121/121d.jpg', './mapa/121/121c.jpg' ],
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.1, v: 0.4 },
                image: [ 
                    './mapa/121/121j.jpg', 
                    './mapa/121/121k.jpg', 
                    './mapa/121/121l.jpg',
                    './mapa/121/121m.jpg',
                    './mapa/121/121n.jpg',
                    './mapa/121/121o.jpg',
                    './mapa/121/121p.jpg'
                ],
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 162        ,
        name: 'San Juan Diego',
        image: './mapa/162.jpg',
        music: './audio/12.m4a',
        hotspots: [
            { position: { u: 0.6, v: 0.3 }, target: 2 },
            { position: { u: 0.7, v: 0.3 }, target: 16 }
        ],
        infospots: [
            {
                position: { u: 0.3, v: 0.3 },
                image: ['./mapa/162/162a.jpg', './mapa/162/162b.jpg', './mapa/162/162c.jpg', './mapa/162/162d.jpg' ],
                video: '',
                title: '',
                description:  ''
            }
        ]
    },
    {
        id: 182        ,
        name: 'Capilla del Pocito',
        image: './mapa/182.jpg',
        music: './audio/12.m4a',
        hotspots: [
            { position: { u: 0.1, v: 0.3 }, target: 18 }
        ],
        infospots: [
            {
                position: { u: 0.47, v: 0.2 },
                image: './mapa/182/182a.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.17, v: 0.2 },
                image: './mapa/182/182b.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.27, v: 0.2 },
                image: './mapa/182/182c.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.67, v: 0.2 },
                image: './mapa/182/182d.jpg',
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.9, v: 0.2 },
                image: './mapa/182/182e.jpg',
                video: '',
                title: '',
                description:  ''
            }
        ]
    }, 
    {
        id: 192        ,
        name: 'Parroquia de Indios',
        image: './mapa/192.jpg',
        music: './audio/19.m4a',
        hotspots: [
            { position: { u: 0.9, v: 0.3 }, target: 19 }
        ],
        infospots: [
            {
                position: { u: 0.37, v: 0.3 },
                image: ['./mapa/192/192b.jpg' ],
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.57, v: 0.3 },
                image: ['./mapa/192/192a.jpg' ],
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.42, v: 0.3 },
                image: [
                    './mapa/192/192d.jpg', 
                    './mapa/192/192f.jpg',
                ],
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.46, v: 0.35 },
                image: [
                    './mapa/192/192g.jpg', 
                    './mapa/192/192h.jpg',
                    './mapa/192/192i.jpg', 
                    './mapa/192/192q.jpg',
                    './mapa/192/192n.jpg',
                    './mapa/192/192o.jpg',
                    './mapa/192/192p.jpg',
                    './mapa/192/192l.jpg',
                    './mapa/192/192m.jpg',
                    './mapa/192/192k.jpg',
                    './mapa/192/192j.jpg'
                ],
                video: '',
                title: '',
                description:  ''
            },
            {
                position: { u: 0.5, v: 0.35 },
                image: '',
                video: './video/1.mp4',
                title: '',
                description:  ''
            }
            // {
            //     position: { u: 0.5, v: 0.3 },
            //     image: [ 
            //         './mapa/192/192i.jpg', 
            //         './mapa/192/192q.jpg',
            //         './mapa/192/192n.jpg',
            //         './mapa/192/192o.jpg',
            //         './mapa/192/192p.jpg',
            //         './mapa/192/192l.jpg',
            //         './mapa/192/192m.jpg',
            //         './mapa/192/192k.jpg',
            //         './mapa/192/192j.jpg'
            //     ],
            //     video: '',
            //     title: '',
            //     description:  ''
            // }
        ]
    },
    {
        id: 0,
        name: 'Fin del recorrido',
        image: './mapa/1.jpg',
        music: './audio/21.m4a',
        hotspots: [
            { position: { u: 0.4, v: 0.35 }, target: 22, label: 'Inicio' },
            { position: { u: 0.5, v: 0.35 }, target: 2 },
            { position: { u: 0.56, v: 0.35 }, target: 21 },
            { position: { u: 0.73, v: 0.35 }, target: 20 },
            { position: { u: 0.85, v: 0.35 }, target: 19 },
        ],
        infospots: [             
            { 
                position: { u: 0.3, v: 0.2 }, 
                image: [ './mapa/1/1a.jpg' ],
                video: '',
                title: 'Bienvenido al paseo virtual de la Básilica de Guadalupe', 
                description: 'Para navegar por el recorrido, utiliza el mouse o el touchpad. Haz clic en los puntos de interés para obtener más información.'
            },
            { 
                position: { u: 0.5, v: 0.7 }, 
                image: '',
                video: './video/1.mp4',
                title: '', 
                description: ''
            }
        ]
    }
    // Add more panoramas as needed
];

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Load info icon texture
const infoTexture = textureLoader.load('./info.svg');

const infoSpriteMaterial = new THREE.SpriteMaterial({
    map: infoTexture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
    sizeAttenuation: true // Maintains consistent size regardless of distance
});

const iconTexture = textureLoader.load('./location.svg', (texture) => {
    // FIX: Ensure texture is properly loaded with error handling
    console.log('Hotspot icon loaded successfully');
    
    // Add custom CSS for the canvas to show pointer cursor on hover
    const canvasStyle = document.createElement('style');
    canvasStyle.innerHTML = `
        canvas {
            cursor: grab;
        }
        canvas:active {
            cursor: grabbing;
        }
    `;
    document.head.appendChild(canvasStyle);
    
    // Once texture is loaded, create initial hotspots
    // loadPanorama(1);
}, undefined, (err) => {
    console.error('Error loading hotspot icon:', err);
});

// Create sprite material with the icon texture
const spriteMaterial = new THREE.SpriteMaterial({ 
    map: iconTexture,
    transparent: true,
    depthTest: false,  // Ensures sprite renders on top of other objects
    depthWrite: false, // Prevents depth buffer writes
    sizeAttenuation: true // Maintains consistent size regardless of distance
});

// Animation parameters for hotspots
const panoramaButtonProperties = {
    normalScale: new THREE.Vector3(5, 5, 1),
    hoverScale: new THREE.Vector3(6, 6, 1),

    pulseSpeed: 0.3,
    pulseAmount: 0.05,

    rotationSpeed: 0.02,
    rotationAmount: 0.7,

    normalColor: new THREE.Color(0xffffff),
    hoverColor: new THREE.Color(0xC1C1C1),

    lerpSpeed: 0.05
};

const hotspotRadius = 35;

// Function to compute 3D position from UV coordinates for a cylinder
function computePosition(u, v) {
    const phi = (1 - u) * 2 * Math.PI; // Horizontal angle (0 to 2π)
    const height = hotspotRadius * 1.2; // Match cylinder height
    
    // For cylindrical mapping
    const x = hotspotRadius * Math.sin(phi);
    const y = height * (v - 0.5); // Map v from 0-1 to -height/2 to height/2
    const z = hotspotRadius * Math.cos(phi);
    
    return new THREE.Vector3(x, y, z);
}

function createPanoramaButton(position, material) {
    const computedPosition = computePosition(position.u, position.v);
    const sprite = new THREE.Sprite(material.clone()); // Clone material to avoid sharing
    sprite.position.copy(computedPosition);

    sprite.scale.copy(panoramaButtonProperties.normalScale);
    sprite.material.color = panoramaButtonProperties.normalColor.clone();

    return sprite;
}

function createInfospots(infospots) {
    infospotsGroup.remove(...infospotsGroup.children);
    
    infospots.forEach(infospot => {
        const sprite = createPanoramaButton(infospot.position, infoSpriteMaterial);

        sprite.userData = {
            type: 'infospot',

            title: infospot.title,
            description: infospot.description,
            
            image: infospot.image,
            video: infospot.video,

            hovered: false,
            pulsePhase: Math.random() * Math.PI * 2, // Random start phase for pulse animation
            initialYRotation: Math.random() * Math.PI * 2 
        };
        infospotsGroup.add(sprite);
    });
}

// Function to create hotspots
function createHotspots(hotspots) {
    hotspotsGroup.remove(...hotspotsGroup.children);
    labelsGroup.clear();

    // Remove existing label elements
    document.querySelectorAll('.hotspot-label').forEach(label => label.remove());
    
    hotspots.forEach((hotspot, index) => {
        console.log('Creating hotspot:', hotspot.target);
        const position = computePosition(hotspot.position.u, hotspot.position.v);
        const sprite = new THREE.Sprite(spriteMaterial.clone());
        sprite.position.copy(position);

        sprite.scale.copy(panoramaButtonProperties.normalScale);
        sprite.material.color = panoramaButtonProperties.normalColor.clone();
        
        sprite.userData = { 
            target: hotspot.target, 
            type: 'hotspot',
            hovered: false,
            pulsePhase: Math.random() * Math.PI * 2, // Random start phase for pulse animation
            initialYRotation: Math.random() * Math.PI * 2  
        };
        hotspotsGroup.add(sprite);

    // Text label
        const pano = panoramas.find(p => p.id === hotspot.target);
        const div = document.createElement('div');
        div.className = 'hotspot-label';
        div.textContent = pano ? `(${pano.id})\n${pano.name}` : `Scene ${hotspot.target}`;
        // you can style .hotspot-label in CSS (font, color, background…)

        console.log('Creating label:', pano.name, 'at position:', position);

        const label = new CSS2DObject(div);
        label.position.copy(position.clone().add(new THREE.Vector3(0, -2, 0)).multiplyScalar(1.05)); // Position label slightly above the hotspot
        // slightly further out so it doesn’t overlap the icon
        label.userData = { type: 'label' };

        labelsGroup.add(label);
    });
}

// Function to load a panorama by ID
function loadPanorama(panoramaId) {
    const panorama = panoramas.find(p => p.id === panoramaId);
    if (!panorama) return;

    currentPanorama = panoramaId; // Update current panorama ID

    // Remove existing hotspots
    hotspotsGroup.remove(...hotspotsGroup.children);
    infospotsGroup.remove(...infospotsGroup.children);

    // Load new texture and update scene
    textureLoader.load(panorama.image, (texture) => {
		// Apply anisotropic filtering for better quality at oblique angles
        texture.colorSpace = THREE.SRGBColorSpace; // <<< Add this line

		if (renderer.capabilities.getMaxAnisotropy) {
			texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
		}
		
		// Filtering and mipmapping for high-res textures
		texture.minFilter = THREE.LinearMipmapLinearFilter;
		texture.magFilter = THREE.LinearFilter;
		texture.generateMipmaps = true;
		
        cylinder.material.map = texture;
        cylinder.material.needsUpdate = true;

		// Update audio when texture loads
        if (window.changeAudio) {
            if (panorama.music && panorama.music.trim() !== '') {
                console.log('calling audio change to', panorama.music);
                window.changeAudio(panorama.music);
            }
        }

        // Create new hotspots & infospots for this panorama
        createHotspots(panorama.hotspots);
        createInfospots(panorama.infospots);
    });

    // Update camera position
    camera.lookAt(panorama.hotspots[0].position); // Look straight ahead

}

// Function to extract panorama ID from URL path
function getPanoramaIdFromUrl() {
    // Get path segments (e.g., ["", "22"] for mysite.com/22)
    const pathSegments = window.location.pathname.split('/');
    
    // Get the last numeric segment that's a valid number
    const numericSegments = pathSegments.filter(segment => !isNaN(segment) && segment !== '');
    const lastNumericSegment = numericSegments[numericSegments.length - 1];
    
    // Parse the ID or default to 1
    return lastNumericSegment ? parseInt(lastNumericSegment, 10) : 1;
}

let currentPanorama = 0;

function nextPanorama() {
    // Get the next panorama ID based on current panorama
    const nextId = (currentPanorama + 1) % panoramas.length;
    loadPanorama(nextId);
}

function prevPanorama() {
    // Get the next panorama ID based on current panorama
    const nextId = (currentPanorama - 1) % panoramas.length;
    loadPanorama(nextId);
}

// Track mouse position for hover effects
const mouse = new THREE.Vector2();
let hoveredHotspot = null;

// Hotspot & infospot hover effects
function updateObjectHoverEffects() {
    // Create raycaster from current mouse position
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    // Set raycaster precision for sprites
    raycaster.params.Sprite = { threshold: isTouchDevice ? 700.0 : 1.5 };
    
    // Check for intersections
    const intersects = raycaster.intersectObjects([
        ...hotspotsGroup.children, 
        ...infospotsGroup.children
    ]);

    // Reset previous hover state if different hotspot or no hotspot is hovered
    if (hoveredHotspot && (intersects.length === 0 || intersects[0].object !== hoveredHotspot)) {
        hoveredHotspot.userData.hovered = false;
        hoveredHotspot = null;
        // Change cursor back to default
        document.body.style.cursor = 'grab';
    }
    
    // Set new hovered hotspot
    if (intersects.length > 0) {
        hoveredHotspot = intersects[0].object;
        hoveredHotspot.userData.hovered = true;
        // Change cursor to pointer to indicate clickable element
        document.body.style.cursor = 'pointer';
    }
    
    // Apply animations to all hotspots
    const time = performance.now() * 0.001; // Current time in seconds
    
    // Update hotspots animations
    hotspotsGroup.children.forEach(sprite => {
        updateObjectAnimation(sprite, time, panoramaButtonProperties);
    });
    
    // Update infospots animations
    infospotsGroup.children.forEach(sprite => {
        updateObjectAnimation(sprite, time, panoramaButtonProperties);
    });
}

function updateObjectAnimation(object, time, animParams) {
    // Make object always face the camera
    object.lookAt(camera.position);

    if (object.userData.hovered) {
        // Smooth transition to hover scale
        object.scale.lerp(animParams.hoverScale, animParams.lerpSpeed);
        
        // Smooth color transition to hover color
        object.material.color.lerp(animParams.hoverColor, animParams.lerpSpeed);
    } else {
        // Base scale with subtle pulse
        const baseScale = animParams.normalScale.clone();
        const idlePulse = 1 + Math.sin(time * animParams.pulseSpeed + object.userData.pulsePhase) * animParams.pulseAmount;
        baseScale.multiplyScalar(idlePulse);
        
        // Smooth transition back to normal scale
        object.scale.lerp(baseScale, animParams.lerpSpeed);
        
        // Smooth color transition back to normal
        object.material.color.lerp(animParams.normalColor, animParams.lerpSpeed);
        
        // Subtle rotation animation
        object.rotation.z = Math.sin(time * animParams.rotationSpeed + object.userData.initialRotation) * animParams.rotationAmount;
    }
}

// Set up OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
const overlay = document.getElementById('overlay-label');

// Limit vertical rotation to avoid seeing the top/bottom edges
controls.minPolarAngle = Math.PI * 0.50; // Restrict looking too far up
controls.maxPolarAngle = Math.PI * 0.50; // Restrict looking too far down

// Limit horizontal rotation to -45° to +45° (convert degrees to radians)
controls.minAzimuthAngle = THREE.MathUtils.degToRad(-130);
controls.maxAzimuthAngle = THREE.MathUtils.degToRad(130);

// Zoom settings
controls.enableZoom = true;
controls.minDistance = 1;    // Prevent zooming too close to the center
controls.maxDistance = 50;   // Prevent zooming too far out, keeping the view immersive

controls.enablePan = false;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.rotateSpeed = 0.5;

controls.touchAction = 'none';

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    controls.update();

    // Update hotspot and infospot animations
    updateObjectHoverEffects();
    
    // Make hotspots always face the camera
    hotspotsGroup.children.forEach(sprite => {
        sprite.lookAt(camera.position);
    });    
    
    infospotsGroup.children.forEach(sprite => {
        sprite.lookAt(camera.position);
    });

    renderer.render(scene, camera);

    labelRenderer.render(scene, camera);
}

animate();

// when the user *starts* interacting…
controls.addEventListener('start', () => {
  overlay.classList.add('to-corner');
//   logo.style.display = 'none';
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    
  // update label renderer
  labelRenderer.setSize(window.innerWidth, window.innerHeight);
});

// Update mouse position on move
window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
});

// Create a function to handle both mouse clicks and touch events
function handleInteraction(event) {
    // Prevent default behavior to avoid any unwanted navigation
    event.preventDefault();
    
	// Close modal
	const modal = document.getElementById('info-modal');
    if (modal && event.target === modal) {
        modal.style.display = 'none';
    }

    // Get the correct coordinates based on event type
    let x, y;
    
    if (event.type.startsWith('touch')) {
        // Use changedTouches for touchend
        const touch = event.changedTouches?.[0] || event.touches?.[0];
        if (!touch) return;
        x = touch.clientX;
        y = touch.clientY;
    } else {
        // Mouse event (desktop)
        x = event.clientX;
        y = event.clientY;
    }
    
    // Convert to normalized device coordinates (-1 to +1)
    const mouse = new THREE.Vector2();
    mouse.x = (x / window.innerWidth) * 2 - 1;
    mouse.y = -(y / window.innerHeight) * 2 + 1;
    
    // Create a raycaster
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    raycaster.params.Sprite = { threshold: isTouchDevice ? 700.0 : 1.5 };

    const intersects = raycaster.intersectObjects([
        ...hotspotsGroup.children,
        ...infospotsGroup.children
    ]);

    if (intersects.length > 0) {
        console.log('Clicked on:', intersects[0].object);
        const object = intersects[0].object;
        if (object.userData.type === 'hotspot') 
        {
            loadPanorama(object.userData.target);
        } 
        else if (object.userData.type === 'infospot') 
        {
            const modal = document.getElementById('info-modal');
            const video = object.userData.video;
            const images = Array.isArray(object.userData.image) 
                ? object.userData.image 
                : [object.userData.image];
            
            // Update modal content
            modal.querySelector('#modal-title').textContent = object.userData.title;
            modal.querySelector('#modal-description').textContent = object.userData.description;

            // Handle image container
            const container = modal.querySelector('#modal-image-container');
            container.innerHTML = ''; // Clear previous content

            if (images.length > 1) {
                // Generate carousel HTML
                container.innerHTML = `
                    ${images.map((img, i) => `
                    <img src="${img}" class="carousel-image ${i === 0 ? 'active' : ''}">
                    `).join('')}
                    <button class="carousel-prev">❮</button>
                    <button class="carousel-next">❯</button>
                    <div class="carousel-dots">
                    ${images.map((_, i) => `
                        <span class="dot ${i === 0 ? 'active' : ''}"></span>
                    `).join('')}
                    </div>
                `;

                // Carousel functionality
                let currentIndex = 0;
                const imagesEls = container.querySelectorAll('.carousel-image');
                const dots = container.querySelectorAll('.dot');

                const updateCarousel = (newIndex) => {
                    imagesEls[currentIndex].classList.remove('active');
                    dots[currentIndex].classList.remove('active');
                    currentIndex = newIndex;
                    imagesEls[currentIndex].classList.add('active');
                    dots[currentIndex].classList.add('active');
                };

                // Navigation handlers
                container.querySelector('.carousel-prev').addEventListener('click', () => 
                    updateCarousel((currentIndex - 1 + images.length) % images.length));
                
                container.querySelector('.carousel-next').addEventListener('click', () => 
                    updateCarousel((currentIndex + 1) % images.length));

                dots.forEach((dot, index) => {
                    dot.addEventListener('click', () => updateCarousel(index));
                });
            } 
            else {
                // Single Image
                if (images[0]?.trim() !== '') { // Optional chaining to prevent errors if undefined
                    console.log('Displaying single image', images[0]);
                    const img = document.createElement('img');
                    img.src = images[0];
                    img.className = 'carousel-image active';
                    container.appendChild(img);
                } else {
                    console.log('Checking for video', video);
                    // Check if video exists and is non-empty after trimming
                    if (video) {
                        const videoElement = document.createElement('video');
                        videoElement.src = video;
                        videoElement.controls = false;
                        videoElement.autoplay = true;
                        videoElement.loop = true;
                        videoElement.className = 'modal-video';
                        container.appendChild(videoElement);
                    } else {
                        console.log('No video available'); // Only logs if video is missing/empty
                    }
                }
            }

            modal.style.display = 'flex';

            return; // Prevent modal from closing
        }
        
        // Provide visual feedback
        intersects[0].object.scale.multiplyScalar(1.2);
        setTimeout(() => {
            if (intersects[0].object) {
                intersects[0].object.scale.divideScalar(1.2);
            }
        }, 200);
    } 
    else {
        console.log('Nothing clicked');
    }
}

window.addEventListener('click', handleInteraction);
window.addEventListener('touchend', (event) => { 
    handleInteraction(event);
    console.log('Touch ended');
});
window.addEventListener('touchstart', () => { 
    console.log('Touch started') 
});

const navigationForward = document.getElementById('navigation-forward');
navigationForward.addEventListener('click', () => {
    nextPanorama();
    console.log('Next panorama');
});

const navigationBack = document.getElementById('navigation-backward');
navigationBack.addEventListener('click', () => {
    prevPanorama();
    console.log('Previous panorama');
});

// Load panorama based on URL or default to 1
loadPanorama(getPanoramaIdFromUrl());
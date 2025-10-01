// Variables globales
let scene, camera, renderer, controls;
let cube, tesseract;
let wireframeMaterial, cubeMaterials, tesseractMaterials;
let rotationSpeed = 1;
let autoRotate = true;
let currentView = 'cube';
let isWireframe = false;

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    init();
    setupEventListeners();
    animate();
});

// Función de inicialización
function init() {
    // Configurar escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x121212);
    
    // Configurar cámara
    const container = document.getElementById('visualization-container');
    const aspect = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 5;
    
    // Configurar renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    
    // Configurar controles
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    
    // Crear materiales
    createMaterials();
    
    // Crear objetos
    createCubeCMY();
    createTesseract();
    
    // Mostrar vista inicial
    updateView();
    
    // Agregar luces
    addLights();
    
    // Manejar redimensionamiento
    window.addEventListener('resize', onWindowResize);
}

// Crear materiales para los objetos
function createMaterials() {
    // Material para wireframe
    wireframeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        wireframe: true 
    });
    
    // Materiales para el cubo CMY con mayor transparencia y brillo
    cubeMaterials = [
        new THREE.MeshPhongMaterial({ 
            color: 0x00ffff,      // Cian
            transparent: true, 
            opacity: 0.65, 
            shininess: 100,
            specular: 0x00ffff,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        }), 
        new THREE.MeshPhongMaterial({ 
            color: 0xff00ff,      // Magenta
            transparent: true, 
            opacity: 0.65, 
            shininess: 100,
            specular: 0xff00ff,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        }), 
        new THREE.MeshPhongMaterial({ 
            color: 0xffff00,      // Amarillo
            transparent: true, 
            opacity: 0.65, 
            shininess: 100,
            specular: 0xffff00,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        })
    ];
    
    // Materiales para el teseracto con efectos visuales mejorados
    tesseractMaterials = [
        new THREE.MeshPhongMaterial({ 
            color: 0x00ffff,      // Cian
            transparent: true, 
            opacity: 0.6, 
            shininess: 120,
            specular: 0x00ffff,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        }),
        new THREE.MeshPhongMaterial({ 
            color: 0xff00ff,      // Magenta
            transparent: true, 
            opacity: 0.6, 
            shininess: 120,
            specular: 0xff00ff,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        }),
        new THREE.MeshPhongMaterial({ 
            color: 0xffff00,      // Amarillo
            transparent: true, 
            opacity: 0.6, 
            shininess: 120,
            specular: 0xffff00,
            side: THREE.DoubleSide,
            blending: THREE.AdditiveBlending
        }),
        new THREE.MeshPhongMaterial({ 
            color: 0xffffff,      // Blanco para estructura
            transparent: true, 
            opacity: 0.25, 
            shininess: 80,
            side: THREE.DoubleSide
        })
    ];
}

// Crear el cubo CMY
function createCubeCMY() {
    cube = new THREE.Group();
    
    // Crear las tres caras translúcidas que forman el cubo CMY
    const size = 2;
    
    // Crear geometría para las caras (planos)
    const planeGeometry = new THREE.PlaneGeometry(size, size);
    
    // Cara Cian (XY)
    const cyanPlane = new THREE.Mesh(planeGeometry, cubeMaterials[0]);
    cyanPlane.position.set(0, 0, size/2);
    cube.add(cyanPlane);
    
    // Cara Magenta (XZ)
    const magentaPlane = new THREE.Mesh(planeGeometry, cubeMaterials[1]);
    magentaPlane.position.set(0, size/2, 0);
    magentaPlane.rotation.x = Math.PI/2;
    cube.add(magentaPlane);
    
    // Cara Amarilla (YZ)
    const yellowPlane = new THREE.Mesh(planeGeometry, cubeMaterials[2]);
    yellowPlane.position.set(size/2, 0, 0);
    yellowPlane.rotation.y = Math.PI/2;
    cube.add(yellowPlane);
    
    // Crear geometría para el wireframe del cubo
    const cubeGeometry = new THREE.BoxGeometry(size, size, size);
    
    // Agregar wireframe
    const wireframe = new THREE.LineSegments(
        new THREE.EdgesGeometry(cubeGeometry),
        new THREE.LineBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.7
        })
    );
    cube.add(wireframe);
    
    scene.add(cube);
}

// Crear el teseracto (proyección 3D)
function createTesseract() {
    tesseract = new THREE.Group();
    
    // Crear los cubos internos y externos para simular el teseracto
    const outerSize = 2;
    const innerSize = 1;
    
    // Cubo externo con material translúcido
    const outerGeometry = new THREE.BoxGeometry(outerSize, outerSize, outerSize);
    const outerCube = new THREE.Mesh(outerGeometry, tesseractMaterials[3]);
    tesseract.add(outerCube);
    
    // Cubo interno con material translúcido
    const innerGeometry = new THREE.BoxGeometry(innerSize, innerSize, innerSize);
    const innerCube = new THREE.Mesh(innerGeometry, tesseractMaterials[3]);
    tesseract.add(innerCube);
    
    // Definir vértices para los cubos externo e interno
    const vertices = [
        [-outerSize/2, -outerSize/2, -outerSize/2],
        [outerSize/2, -outerSize/2, -outerSize/2],
        [-outerSize/2, outerSize/2, -outerSize/2],
        [outerSize/2, outerSize/2, -outerSize/2],
        [-outerSize/2, -outerSize/2, outerSize/2],
        [outerSize/2, -outerSize/2, outerSize/2],
        [-outerSize/2, outerSize/2, outerSize/2],
        [outerSize/2, outerSize/2, outerSize/2]
    ];
    
    const innerVertices = [
        [-innerSize/2, -innerSize/2, -innerSize/2],
        [innerSize/2, -innerSize/2, -innerSize/2],
        [-innerSize/2, innerSize/2, -innerSize/2],
        [innerSize/2, innerSize/2, -innerSize/2],
        [-innerSize/2, -innerSize/2, innerSize/2],
        [innerSize/2, -innerSize/2, innerSize/2],
        [-innerSize/2, innerSize/2, innerSize/2],
        [innerSize/2, innerSize/2, innerSize/2]
    ];
    
    // Crear líneas de conexión con efectos visuales mejorados
    const colorMap = [
        0x00ffff, // Cian (0-1)
        0x00ffff, // Cian (2-3)
        0xff00ff, // Magenta (4-5)
        0xff00ff, // Magenta (6-7)
        0xffff00, // Amarillo (0-2)
        0xffff00, // Amarillo (1-3)
        0xffff00, // Amarillo (4-6)
        0xffff00  // Amarillo (5-7)
    ];
    
    for (let i = 0; i < 8; i++) {
        const lineMaterial = new THREE.LineBasicMaterial({ 
            color: colorMap[i],
            transparent: true,
            opacity: 0.8,
            linewidth: 2
        });
        
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(...vertices[i]),
            new THREE.Vector3(...innerVertices[i])
        ]);
        
        const line = new THREE.Line(lineGeometry, lineMaterial);
        tesseract.add(line);
    }
    
    // Agregar wireframes con efectos visuales mejorados
    const outerWireframe = new THREE.LineSegments(
        new THREE.EdgesGeometry(outerGeometry),
        new THREE.LineBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        })
    );
    tesseract.add(outerWireframe);
    
    const innerWireframe = new THREE.LineSegments(
        new THREE.EdgesGeometry(innerGeometry),
        new THREE.LineBasicMaterial({ 
            color: 0xffffff,
            transparent: true,
            opacity: 0.8
        })
    );
    tesseract.add(innerWireframe);
    
    // Colorear caras del teseracto con colores CMY
    addColoredFaces();
    
    scene.add(tesseract);
    tesseract.visible = false;
}

// Agregar caras coloreadas al teseracto
function addColoredFaces() {
    const size = 2;
    const halfSize = size / 2;
    
    // Crear planos para las caras con colores CMY
    const planeGeometry = new THREE.PlaneGeometry(size, size);
    
    // Cara Cian (frente) - Cubo externo
    const cyanPlane = new THREE.Mesh(planeGeometry, tesseractMaterials[0]);
    cyanPlane.position.set(0, 0, halfSize);
    tesseract.add(cyanPlane);
    
    // Cara Cian (atrás) - Cubo interno
    const cyanPlaneInner = new THREE.Mesh(planeGeometry, tesseractMaterials[0]);
    cyanPlaneInner.position.set(0, 0, halfSize/2);
    cyanPlaneInner.scale.set(0.5, 0.5, 0.5);
    tesseract.add(cyanPlaneInner);
    
    // Cara Magenta (derecha) - Cubo externo
    const magentaPlane = new THREE.Mesh(planeGeometry, tesseractMaterials[1]);
    magentaPlane.position.set(halfSize, 0, 0);
    magentaPlane.rotation.y = Math.PI / 2;
    tesseract.add(magentaPlane);
    
    // Cara Magenta (izquierda) - Cubo interno
    const magentaPlaneInner = new THREE.Mesh(planeGeometry, tesseractMaterials[1]);
    magentaPlaneInner.position.set(halfSize/2, 0, 0);
    magentaPlaneInner.rotation.y = Math.PI / 2;
    magentaPlaneInner.scale.set(0.5, 0.5, 0.5);
    tesseract.add(magentaPlaneInner);
    
    // Cara Amarilla (arriba) - Cubo externo
    const yellowPlane = new THREE.Mesh(planeGeometry, tesseractMaterials[2]);
    yellowPlane.position.set(0, halfSize, 0);
    yellowPlane.rotation.x = -Math.PI / 2;
    tesseract.add(yellowPlane);
    
    // Cara Amarilla (abajo) - Cubo interno
    const yellowPlaneInner = new THREE.Mesh(planeGeometry, tesseractMaterials[2]);
    yellowPlaneInner.position.set(0, halfSize/2, 0);
    yellowPlaneInner.rotation.x = -Math.PI / 2;
    yellowPlaneInner.scale.set(0.5, 0.5, 0.5);
    tesseract.add(yellowPlaneInner);
}

// Agregar luces a la escena
function addLights() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    scene.add(directionalLight1);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-5, -5, -5);
    scene.add(directionalLight2);
}

// Configurar event listeners
function setupEventListeners() {
    // Botones de vista
    document.getElementById('cube-view').addEventListener('click', () => {
        currentView = 'cube';
        updateView();
    });
    
    document.getElementById('tesseract-view').addEventListener('click', () => {
        currentView = 'tesseract';
        updateView();
    });
    
    // Control de velocidad de rotación
    document.getElementById('rotation-speed').addEventListener('input', (e) => {
        rotationSpeed = parseFloat(e.target.value);
    });
    
    // Botones de rotación
    document.getElementById('rotate-x').addEventListener('click', () => {
        rotateCurrentObject('x');
    });
    
    document.getElementById('rotate-y').addEventListener('click', () => {
        rotateCurrentObject('y');
    });
    
    document.getElementById('rotate-z').addEventListener('click', () => {
        rotateCurrentObject('z');
    });
    
    document.getElementById('rotate-w').addEventListener('click', () => {
        rotateW();
    });
    
    // Botón de reset
    document.getElementById('reset-view').addEventListener('click', resetView);
    
    // Botón de wireframe
    document.getElementById('toggle-wireframe').addEventListener('click', toggleWireframe);
}

// Actualizar la vista actual
function updateView() {
    // Actualizar visibilidad de objetos
    cube.visible = (currentView === 'cube');
    tesseract.visible = (currentView === 'tesseract');
    
    // Actualizar clases de botones
    document.getElementById('cube-view').classList.toggle('active', currentView === 'cube');
    document.getElementById('tesseract-view').classList.toggle('active', currentView === 'tesseract');
    
    // Actualizar información visible
    document.getElementById('cube-info').classList.toggle('active', currentView === 'cube');
    document.getElementById('tesseract-info').classList.toggle('active', currentView === 'tesseract');
    
    // Actualizar controles específicos
    document.querySelectorAll('.tesseract-only').forEach(el => {
        el.style.display = (currentView === 'tesseract') ? 'block' : 'none';
    });
    
    // Resetear la vista
    resetView();
}

// Rotar el objeto actual
function rotateCurrentObject(axis) {
    const currentObject = (currentView === 'cube') ? cube : tesseract;
    const rotationAmount = Math.PI / 4; // 45 grados
    
    switch(axis) {
        case 'x':
            currentObject.rotation.x += rotationAmount;
            break;
        case 'y':
            currentObject.rotation.y += rotationAmount;
            break;
        case 'z':
            currentObject.rotation.z += rotationAmount;
            break;
    }
}

// Rotación 4D (simulada)
function rotateW() {
    if (currentView !== 'tesseract') return;
    
    // Simular rotación 4D con efectos más complejos
    const innerCube = tesseract.children[1];
    const scale = innerCube.scale.x;
    
    // Obtener caras internas del teseracto (añadidas en addColoredFaces)
    const cyanPlaneInner = tesseract.children[12]; // Índice basado en el orden de creación
    const magentaPlaneInner = tesseract.children[14];
    const yellowPlaneInner = tesseract.children[16];
    
    // Ciclo de transformación para simular rotación 4D
    if (scale < 0.3) {
        // Reiniciar el ciclo
        innerCube.scale.set(1, 1, 1);
        
        // Reiniciar posiciones de las caras internas
        cyanPlaneInner.position.set(0, 0, 1/2);
        cyanPlaneInner.scale.set(0.5, 0.5, 0.5);
        
        magentaPlaneInner.position.set(1/2, 0, 0);
        magentaPlaneInner.scale.set(0.5, 0.5, 0.5);
        
        yellowPlaneInner.position.set(0, 1/2, 0);
        yellowPlaneInner.scale.set(0.5, 0.5, 0.5);
    } else {
        // Reducir escala gradualmente
        const newScale = scale - 0.1;
        innerCube.scale.set(newScale, newScale, newScale);
        
        // Ajustar posiciones de las caras internas para efecto de rotación 4D
        cyanPlaneInner.scale.set(newScale/2, newScale/2, newScale/2);
        cyanPlaneInner.position.z = 1/2 * newScale;
        
        magentaPlaneInner.scale.set(newScale/2, newScale/2, newScale/2);
        magentaPlaneInner.position.x = 1/2 * newScale;
        
        yellowPlaneInner.scale.set(newScale/2, newScale/2, newScale/2);
        yellowPlaneInner.position.y = 1/2 * newScale;
        
        // Añadir efecto de rotación a las caras internas
        cyanPlaneInner.rotation.z += 0.05;
        magentaPlaneInner.rotation.x += 0.05;
        yellowPlaneInner.rotation.y += 0.05;
    }
    
    // Actualizar líneas de conexión
    updateTesseractConnections();
}

// Actualizar conexiones del teseracto
function updateTesseractConnections() {
    const innerCube = tesseract.children[1];
    const scale = innerCube.scale.x;
    
    // Actualizar posiciones de las líneas con efecto de distorsión
    for (let i = 0; i < 8; i++) {
        const line = tesseract.children[i + 2];
        const linePositions = line.geometry.attributes.position.array;
        
        // Calcular ángulo para efecto de rotación
        const angle = (Date.now() % 2000) / 2000 * Math.PI * 2;
        const distortion = Math.sin(angle + i) * 0.1;
        
        // Actualizar el segundo punto de cada línea con distorsión
        const innerVertex = [
            linePositions[0] * scale * (1 + distortion),
            linePositions[1] * scale * (1 - distortion),
            linePositions[2] * scale
        ];
        
        linePositions[3] = innerVertex[0];
        linePositions[4] = innerVertex[1];
        linePositions[5] = innerVertex[2];
        
        line.geometry.attributes.position.needsUpdate = true;
        
        // Actualizar opacidad para efecto visual
        line.material.opacity = 0.5 + Math.sin(angle + i * 0.5) * 0.3;
    }
}

// Resetear la vista
function resetView() {
    const currentObject = (currentView === 'cube') ? cube : tesseract;
    currentObject.rotation.set(0, 0, 0);
    
    camera.position.set(0, 0, 5);
    controls.reset();
    
    if (currentView === 'tesseract') {
        const innerCube = tesseract.children[1];
        innerCube.scale.set(1, 1, 1);
        updateTesseractConnections();
    }
}

// Alternar wireframe
function toggleWireframe() {
    isWireframe = !isWireframe;
    
    // Actualizar materiales del cubo
    cubeMaterials.forEach(material => {
        material.wireframe = isWireframe;
    });
    
    // Actualizar materiales del teseracto
    tesseractMaterials.forEach(material => {
        material.wireframe = isWireframe;
    });
}

// Manejar redimensionamiento de ventana
function onWindowResize() {
    const container = document.getElementById('visualization-container');
    const aspect = container.clientWidth / container.clientHeight;
    
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
}

// Función de animación
function animate() {
    requestAnimationFrame(animate);
    
    // Actualizar controles
    controls.update();
    
    // Rotación automática
    if (autoRotate) {
        if (currentView === 'cube') {
            cube.rotation.y += 0.005 * rotationSpeed;
            cube.rotation.x += 0.002 * rotationSpeed;
            
            // Efecto de pulsación para las caras del cubo CMY
            const time = Date.now() * 0.001;
            const pulseFactor = Math.sin(time) * 0.1 + 0.9; // Oscila entre 0.8 y 1.0
            
            // Aplicar pulsación a las caras del cubo
            for (let i = 0; i < cube.children.length; i++) {
                if (cube.children[i].isMesh && i < 3) { // Solo las tres caras CMY
                    // Ajustar opacidad para efecto de pulsación
                    cube.children[i].material.opacity = 0.65 * pulseFactor;
                    
                    // Efecto de color cambiante sutil
                    if (i === 0) { // Cara cian
                        cube.children[i].material.color.g = 0.8 + Math.sin(time * 1.2) * 0.2;
                        cube.children[i].material.color.b = 0.8 + Math.sin(time * 1.5) * 0.2;
                    } else if (i === 1) { // Cara magenta
                        cube.children[i].material.color.r = 0.8 + Math.sin(time * 1.3) * 0.2;
                        cube.children[i].material.color.b = 0.8 + Math.sin(time * 1.1) * 0.2;
                    } else if (i === 2) { // Cara amarilla
                        cube.children[i].material.color.r = 0.8 + Math.sin(time * 1.4) * 0.2;
                        cube.children[i].material.color.g = 0.8 + Math.sin(time * 1.6) * 0.2;
                    }
                }
            }
        } else {
            tesseract.rotation.y += 0.005 * rotationSpeed;
            tesseract.rotation.x += 0.002 * rotationSpeed;
            
            // Simular rotación 4D cada cierto tiempo con patrón más fluido
            const time = Date.now() * 0.001;
            if (Math.sin(time * 0.5) > 0.7) { // Crea un patrón más natural de rotación
                rotateW();
            }
            
            // Efecto de color cambiante para las caras del teseracto
            const cyanPlane = tesseract.children[11]; // Cara cian externa
            const magentaPlane = tesseract.children[13]; // Cara magenta externa
            const yellowPlane = tesseract.children[15]; // Cara amarilla externa
            
            // Efectos de color pulsantes para las caras externas
            cyanPlane.material.opacity = 0.6 + Math.sin(time * 1.2) * 0.2;
            magentaPlane.material.opacity = 0.6 + Math.sin(time * 1.5) * 0.2;
            yellowPlane.material.opacity = 0.6 + Math.sin(time * 1.8) * 0.2;
            
            // Ajustar intensidad de colores
            cyanPlane.material.color.g = 0.8 + Math.sin(time * 1.1) * 0.2;
            cyanPlane.material.color.b = 0.8 + Math.sin(time * 1.3) * 0.2;
            
            magentaPlane.material.color.r = 0.8 + Math.sin(time * 1.4) * 0.2;
            magentaPlane.material.color.b = 0.8 + Math.sin(time * 1.2) * 0.2;
            
            yellowPlane.material.color.r = 0.8 + Math.sin(time * 1.6) * 0.2;
            yellowPlane.material.color.g = 0.8 + Math.sin(time * 1.5) * 0.2;
        }
    }
    
    // Renderizar escena
    renderer.render(scene, camera);
}
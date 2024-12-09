document.addEventListener("DOMContentLoaded", () => {
    const triggerImages = document.querySelectorAll(".trigger-image");
    const modelModal = document.getElementById("modelModal");
    const closeButton = document.getElementById("closeButton");
    const modelContainer = document.getElementById("modelContainer");
    const searchBar = document.getElementById("searchBar");
    const searchResults = document.getElementById("searchResults");
    const notAvailable = document.getElementById("notAvailable");
    const voiceButton = document.getElementById("voiceButton");

    let model; // Declare the model variable outside to access it globally
    let mixer; // For animations (if needed)

    function initialize3DModel() {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, modelContainer.clientWidth / modelContainer.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setClearColor(0xfffaaa);
        renderer.setSize(modelContainer.clientWidth, modelContainer.clientHeight);
        modelContainer.appendChild(renderer.domElement);

        const ambientLight = new THREE.AmbientLight(0x404040, 1);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 7.5).normalize();
        scene.add(directionalLight);

        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(-10, 10, 10);
        scene.add(pointLight);

        const pointLight2 = new THREE.PointLight(0xffffff, 0.5, 100);
        pointLight2.position.set(10, -10, -10);
        scene.add(pointLight2);

        // OrbitControls for camera
        const controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.enableZoom = true;
        controls.zoomSpeed = 1.2;
        controls.minDistance = 1;
        controls.maxDistance = 100;

        const loader = new THREE.GLTFLoader();
        loader.load(
            'tree.glb',
            function(gltf) {
                model = gltf.scene; // Store the loaded model in the global variable
                model.scale.set(0.5, 0.5, 0.5);
                model.position.set(-200, -200, ); // Adjust position if needed
                scene.add(model);

                // Initial rotation of the model
                model.rotation.y = Math.PI / 2;
            },
            function(xhr) {
                console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            function(error) {
                console.error('An error happened', error);
            }
        );

        camera.position.set(-300, -500, -200); // Set camera position to view the model
        controls.update();

        // Custom rotation function
        let isDragging = false;
        let previousMousePosition = {
            x: 0,
            y: 0
        };

        // Listen for mouse down, move, and up events for manual model rotation
        renderer.domElement.addEventListener('mousedown', function(e) {
            isDragging = true;
        });

        renderer.domElement.addEventListener('mousemove', function(e) {
            if (isDragging) {
                const deltaMove = {
                    x: e.offsetX - previousMousePosition.x,
                    y: e.offsetY - previousMousePosition.y
                };

                if (model) {
                    // Rotate model based on mouse movement
                    model.rotation.y += deltaMove.x * 0.01; // Rotate around the Y-axis
                    model.rotation.x += deltaMove.y * 0.01; // Rotate around the X-axis
                }

                previousMousePosition = {
                    x: e.offsetX,
                    y: e.offsetY
                };
            }
        });

        renderer.domElement.addEventListener('mouseup', function() {
            isDragging = false;
        });

        renderer.domElement.addEventListener('mouseleave', function() {
            isDragging = false;
        });

        // Animate function
        const animate = function() {
            requestAnimationFrame(animate);

            controls.update(); // Update camera controls
            renderer.render(scene, camera);
        };

        animate();
    }

    triggerImages.forEach((image) => {
        image.addEventListener('click', () => {
            const altText = image.alt.toLowerCase();
            if (altText.includes("neem")) {
                modelModal.style.display = 'block';
                initialize3DModel();

                // Voice synthesis functionality triggered after clicking the Neem tree picture
                const instructionText = "Press V for voice";
                const instructionUtterance = new SpeechSynthesisUtterance(instructionText);
                instructionUtterance.lang = 'en-US';
                instructionUtterance.rate = 1;
                instructionUtterance.pitch = 1;
                window.speechSynthesis.speak(instructionUtterance);
            } else {
                modelModal.style.display = 'none';
            }
        });
    });

    closeButton.addEventListener('click', () => {
        modelModal.style.display = 'none';
        while (modelContainer.firstChild) {
            modelContainer.removeChild(modelContainer.firstChild);
        }
        window.speechSynthesis.cancel(); // Stop speaking when modal is closed
    });

    searchBar.addEventListener('input', () => {
        const query = searchBar.value.toLowerCase();
        let found = false;

        triggerImages.forEach((image) => {
            const imageName = image.dataset.name.toLowerCase();
            const altText = image.alt.toLowerCase();
            const container = image.parentElement;

            if (imageName.includes(query) || altText.includes(query)) {
                container.style.display = 'block';
                found = true;
            } else {
                container.style.display = 'none';
            }
        });

        notAvailable.style.display = found ? 'none' : 'block';
    });

    // Voice synthesis on pressing 'v' or 'V'
    document.addEventListener('keydown', (event) => {
        if (event.key === 'v' || event.key === 'V') {
            const speak0Text = document.getElementById('speak0').innerText;
            const speak2Text = document.getElementById('speak2').innerText;
            const speak3Text = document.getElementById('speak3').innerText;
            const speak4Text = document.getElementById('speak4').innerText;
            const speak5Text = document.getElementById('speak5').innerText;

            const combinedText = speak0Text + " " + speak2Text + " " + speak3Text + " " + speak4Text + " " + speak5Text;
            const utterance = new SpeechSynthesisUtterance(combinedText);

            utterance.lang = 'en-US';
            utterance.rate = 1;
            utterance.pitch = 1;

            window.speechSynthesis.speak(utterance);
        }
    });
});

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function GargantuaImproved() {
  const containerRef = useRef(null);
  const materialRef = useRef(null);
  
  // Star animation controls
  const [starSize, setStarSize] = useState(1.0);
  const [twinkleIntensity, setTwinkleIntensity] = useState(0.3);
  const [twinkleSpeed, setTwinkleSpeed] = useState(1.0);
  const [moveSpeed, setMoveSpeed] = useState(0.0);
  const [streakLength, setStreakLength] = useState(0.0);
  const [starDensity, setStarDensity] = useState(1.0);
  const [blackHoleDistance, setBlackHoleDistance] = useState(50.0);
  const [blackHoleEnabled, setBlackHoleEnabled] = useState(true);
  const [rotateSkybox, setRotateSkybox] = useState(false);
  // Disk appearance controls
  const [diskStreaks, setDiskStreaks] = useState(4.0);
  const [diskBlur, setDiskBlur] = useState(0.0);
  const [bloomIntensity, setBloomIntensity] = useState(0.3);
  const [diskBrightness, setDiskBrightness] = useState(1.0);
  // Cloud controls
  const [cloudScale, setCloudScale] = useState(3.0);
  const [cloudDensity, setCloudDensity] = useState(1.0);
  const [cloudDetail, setCloudDetail] = useState(0.6);
  const [shadowStrength, setShadowStrength] = useState(1.5);
  const [cloudSpeed, setCloudSpeed] = useState(2.0);
  const [streakSpeed, setStreakSpeed] = useState(1.0);
  const [diskTilt, setDiskTilt] = useState(0.2);
  const [bandCompression, setBandCompression] = useState(1.0);
  const [diskThickness, setDiskThickness] = useState(1.0);
  const [edgeFalloff, setEdgeFalloff] = useState(0.5);
  const [movementLocked, setMovementLocked] = useState(true);
  const [showControls, setShowControls] = useState(true);
  
  const mouseRef = useRef({ x: 0, y: 0 });
  const lockedPosRef = useRef({ x: 0, y: 0 });
  
  // Reset camera to center
  const resetCamera = () => {
    if (materialRef.current && containerRef.current) {
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      const centerX = w / 2;
      const centerY = h / 2;
      mouseRef.current = { x: centerX, y: centerY };
      lockedPosRef.current = { x: centerX, y: centerY };
      materialRef.current.uniforms.iMouse.value.set(centerX, centerY, 0, 0);
    }
  };
  
  // Toggle lock
  const toggleLock = () => {
    if (!movementLocked) {
      // Locking - save current position
      lockedPosRef.current = { ...mouseRef.current };
    }
    setMovementLocked(!movementLocked);
  };
  
  // Export settings
  const exportSettings = () => {
    const settings = {
      starSize, twinkleIntensity, twinkleSpeed, moveSpeed, streakLength, starDensity,
      blackHoleDistance, blackHoleEnabled, rotateSkybox,
      diskStreaks, diskBlur, bloomIntensity, diskBrightness,
      cloudScale, cloudDensity, cloudDetail, shadowStrength, cloudSpeed,
      streakSpeed, diskTilt, bandCompression, diskThickness, edgeFalloff
    };
    const json = JSON.stringify(settings, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gargantua-settings.json';
    a.click();
    URL.revokeObjectURL(url);
  };
  
  // Import settings
  const importSettings = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const settings = JSON.parse(event.target.result);
            if (settings.starSize !== undefined) setStarSize(settings.starSize);
            if (settings.twinkleIntensity !== undefined) setTwinkleIntensity(settings.twinkleIntensity);
            if (settings.twinkleSpeed !== undefined) setTwinkleSpeed(settings.twinkleSpeed);
            if (settings.moveSpeed !== undefined) setMoveSpeed(settings.moveSpeed);
            if (settings.streakLength !== undefined) setStreakLength(settings.streakLength);
            if (settings.starDensity !== undefined) setStarDensity(settings.starDensity);
            if (settings.blackHoleDistance !== undefined) setBlackHoleDistance(settings.blackHoleDistance);
            if (settings.blackHoleEnabled !== undefined) setBlackHoleEnabled(settings.blackHoleEnabled);
            if (settings.rotateSkybox !== undefined) setRotateSkybox(settings.rotateSkybox);
            if (settings.diskStreaks !== undefined) setDiskStreaks(settings.diskStreaks);
            if (settings.diskBlur !== undefined) setDiskBlur(settings.diskBlur);
            if (settings.bloomIntensity !== undefined) setBloomIntensity(settings.bloomIntensity);
            if (settings.diskBrightness !== undefined) setDiskBrightness(settings.diskBrightness);
            if (settings.cloudScale !== undefined) setCloudScale(settings.cloudScale);
            if (settings.cloudDensity !== undefined) setCloudDensity(settings.cloudDensity);
            if (settings.cloudDetail !== undefined) setCloudDetail(settings.cloudDetail);
            if (settings.shadowStrength !== undefined) setShadowStrength(settings.shadowStrength);
            if (settings.cloudSpeed !== undefined) setCloudSpeed(settings.cloudSpeed);
            if (settings.streakSpeed !== undefined) setStreakSpeed(settings.streakSpeed);
            if (settings.diskTilt !== undefined) setDiskTilt(settings.diskTilt);
            if (settings.bandCompression !== undefined) setBandCompression(settings.bandCompression);
            if (settings.diskThickness !== undefined) setDiskThickness(settings.diskThickness);
            if (settings.edgeFalloff !== undefined) setEdgeFalloff(settings.edgeFalloff);
          } catch (err) {
            alert('Error loading settings file');
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };
  
  // Update mouse uniform based on lock state
  useEffect(() => {
    let frameId;
    const updateMouse = () => {
      if (materialRef.current) {
        if (movementLocked) {
          materialRef.current.uniforms.iMouse.value.set(lockedPosRef.current.x, lockedPosRef.current.y, 0, 0);
        } else {
          materialRef.current.uniforms.iMouse.value.set(mouseRef.current.x, mouseRef.current.y, 0, 0);
        }
      }
      frameId = requestAnimationFrame(updateMouse);
    };
    updateMouse();
    return () => cancelAnimationFrame(frameId);
  }, [movementLocked]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    const geometry = new THREE.PlaneGeometry(2, 2);
    
    const material = new THREE.ShaderMaterial({
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(containerRef.current.clientWidth, containerRef.current.clientHeight) },
        iMouse: { value: new THREE.Vector4(0, 0, 0, 0) },
        uStarSize: { value: 1.0 },
        uTwinkleIntensity: { value: 0.3 },
        uTwinkleSpeed: { value: 1.0 },
        uMoveSpeed: { value: 0.0 },
        uStreakLength: { value: 0.0 },
        uStarDensity: { value: 1.0 },
        uBlackHoleDistance: { value: 50.0 },
        uBlackHoleEnabled: { value: 1.0 },
        uRotateSkybox: { value: 0.0 },
        uDiskStreaks: { value: 4.0 },
        uDiskBlur: { value: 0.0 },
        uBloomIntensity: { value: 0.3 },
        uDiskBrightness: { value: 1.0 },
        uCloudScale: { value: 3.0 },
        uCloudDensity: { value: 1.0 },
        uCloudDetail: { value: 0.6 },
        uShadowStrength: { value: 1.5 },
        uCloudSpeed: { value: 2.0 },
        uStreakSpeed: { value: 1.0 },
        uDiskTilt: { value: 0.2 },
        uBandCompression: { value: 1.0 },
        uDiskThickness: { value: 1.0 },
        uEdgeFalloff: { value: 0.5 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        #define ITERATIONS 2000
        #define PI 3.14159265
        #define SCHWARZSCHILD 1.0
        #define PHOTON_SPHERE 1.5
        #define DISK_INNER 1.8
        #define DISK_OUTER 10.0
        
        uniform float iTime;
        uniform vec2 iResolution;
        uniform vec4 iMouse;
        uniform float uStarSize;
        uniform float uTwinkleIntensity;
        uniform float uTwinkleSpeed;
        uniform float uMoveSpeed;
        uniform float uStreakLength;
        uniform float uStarDensity;
        uniform float uBlackHoleDistance;
        uniform float uBlackHoleEnabled;
        uniform float uRotateSkybox;
        uniform float uDiskStreaks;
        uniform float uDiskBlur;
        uniform float uBloomIntensity;
        uniform float uDiskBrightness;
        uniform float uCloudScale;
        uniform float uCloudDensity;
        uniform float uCloudDetail;
        uniform float uShadowStrength;
        uniform float uCloudSpeed;
        uniform float uStreakSpeed;
        uniform float uDiskTilt;
        uniform float uBandCompression;
        uniform float uDiskThickness;
        uniform float uEdgeFalloff;
        
        varying vec2 vUv;
        
        // Better hash - less pattern artifacts
        float hash(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * 0.1031);
          p3 += dot(p3, p3.yzx + 33.33);
          return fract((p3.x + p3.y) * p3.z);
        }
        
        float hash3(vec3 p) {
          p = fract(p * vec3(0.1031, 0.1030, 0.0973));
          p += dot(p, p.yxz + 33.33);
          return fract((p.x + p.y) * p.z);
        }
        
        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          // Quintic interpolation for smoother result
          f = f * f * f * (f * (f * 6.0 - 15.0) + 10.0);
          
          return mix(
            mix(mix(hash3(i), hash3(i + vec3(1,0,0)), f.x),
                mix(hash3(i + vec3(0,1,0)), hash3(i + vec3(1,1,0)), f.x), f.y),
            mix(mix(hash3(i + vec3(0,0,1)), hash3(i + vec3(1,0,1)), f.x),
                mix(hash3(i + vec3(0,1,1)), hash3(i + vec3(1,1,1)), f.x), f.y),
            f.z);
        }
        
        // Star field - spherical with pseudo-depth for parallax
        float stars(vec3 dir, float time, out vec3 starColor) {
          dir = normalize(dir);
          
          float s = 0.0;
          starColor = vec3(0.0);
          
          // Convert to spherical coords
          float theta = atan(dir.z, dir.x);
          float phi = asin(clamp(dir.y, -1.0, 1.0));
          vec2 baseUV = vec2(theta / (2.0 * PI) + 0.5, phi / PI + 0.5);
          
          // Distance range - stars exist between these depths
          float minDepth = 200.0;
          float maxDepth = 1000.0;
          
          // Size limits
          float minSize = 0.00008;
          float maxSize = 0.0004;
          
          // Multiple star layers at different "depths"
          for (float layer = 0.0; layer < 4.0; layer++) {
            float t = layer / 3.0;
            float layerDepth = mix(minDepth, maxDepth, t);
            float depthNorm = layerDepth / minDepth;
            
            vec2 uv = baseUV;
            
            if (uRotateSkybox > 0.5) {
              // Rotate mode: entire skybox rotates uniformly
              float rotateAmount = uMoveSpeed * time * 0.01;
              uv.x = fract(uv.x + rotateAmount);
            } else {
              // Travel mode: parallax based on depth
              float parallaxScale = uMoveSpeed * time * 0.015 / depthNorm;
              uv = uv + vec2(parallaxScale, parallaxScale * 0.3);
            }
            
            uv = fract(uv);
            
            float scale = 300.0 + layer * 150.0;
            vec2 grid = floor(uv * scale);
            float h = hash(grid + layer * 137.0);
            
            float densityMod = (1.0 - uStarDensity) * 0.04;
            float threshold = 0.93 + densityMod;
            
            if (h > threshold) {
              vec2 jitter = vec2(hash(grid + 1.0), hash(grid + 2.0)) - 0.5;
              vec2 center = (grid + 0.5 + jitter * 0.8) / scale;
              vec2 diff = uv - center;
              
              // Streak only in travel mode
              if (uStreakLength > 0.0 && uMoveSpeed > 0.0 && uRotateSkybox < 0.5) {
                float streakAmount = uStreakLength / depthNorm;
                diff.x /= (1.0 + streakAmount * 2.0);
              }
              
              float d = length(diff);
              
              float brightness = (h - threshold) * 35.0 / depthNorm;
              
              // Twinkle
              float twinkle = 1.0;
              if (hash(grid + 3.0) > 0.6) {
                float speed = (0.5 + hash(grid + 4.0) * 4.0) * uTwinkleSpeed;
                float phase = hash(grid + 5.0) * 6.28;
                twinkle = sin(time * speed + phase) * uTwinkleIntensity + (1.0 - uTwinkleIntensity);
              }
              
              float baseRadius = (0.0002 + hash(grid + 7.0) * 0.0002) * uStarSize / depthNorm;
              float starRadius = clamp(baseRadius, minSize, maxSize);
              
              float star = smoothstep(starRadius, 0.0, d) * brightness * twinkle;
              
              float colorSeed = hash(grid + 6.0);
              vec3 thisColor;
              if (colorSeed < 0.5) thisColor = vec3(0.95, 0.95, 1.0);
              else if (colorSeed < 0.75) thisColor = vec3(0.7, 0.8, 1.0);
              else if (colorSeed < 0.9) thisColor = vec3(1.0, 0.95, 0.8);
              else thisColor = vec3(1.0, 0.8, 0.6);
              
              starColor += thisColor * star;
              s += star;
            }
          }
          return s;
        }
        
        mat3 rotateX(float a) {
          float c = cos(a), s = sin(a);
          return mat3(1, 0, 0, 0, c, -s, 0, s, c);
        }
        
        mat3 rotateY(float a) {
          float c = cos(a), s = sin(a);
          return mat3(c, 0, s, 0, 1, 0, -s, 0, c);
        }
        
        mat3 rotateZ(float a) {
          float c = cos(a), s = sin(a);
          return mat3(c, -s, 0, s, c, 0, 0, 0, 1);
        }
        
        // Accretion disk - Interstellar style with orbital streaks and glow
        vec4 sampleDisk(vec3 pos, float time) {
          float r = length(pos.xz);
          // Band compression - scale y to compress/expand vertical bands
          float y = pos.y * uBandCompression;
          
          // Disk thickness extends outer radius
          float outerRadius = DISK_OUTER * uDiskThickness;
          
          if (r > outerRadius) return vec4(0.0);
          if (r < DISK_INNER * 0.7) return vec4(0.0);
          
          float radialNorm = clamp((r - DISK_INNER) / (outerRadius - DISK_INNER), 0.0, 1.0);
          
          // Calculate orbit angle
          float angle = atan(pos.z, pos.x);
          float orbitSpeed = 0.25 / (r * 0.12 + 0.8);
          float orbitRotation = time * orbitSpeed * uStreakSpeed;  // Rotation over time
          float orbit = angle - orbitRotation;  // Current rotated position
          
          // Thickness - visible base for cloud character
          float baseThickness = mix(0.3, 0.6, radialNorm) * 1.3;
          
          // 3D CLOUD DENSITY - chunky base + fine detail layered on top
          float cloudStrength = uCloudDensity;
          float timeScale = time * uCloudSpeed * 0.15;
          
          // Base chunky clouds - always present (large scale)
          vec3 basePos1 = pos * uCloudScale * 0.15;
          vec3 basePos2 = pos * uCloudScale * 0.08 + vec3(50.0, 0.0, 25.0);
          float baseCloud = noise(basePos1 + vec3(timeScale, 0.0, timeScale * 1.5)) * 0.6 +
                           noise(basePos2 + vec3(timeScale * 0.7, 0.0, timeScale)) * 0.4;
          
          // Fine detail layers - controlled by detail slider
          float fineDetail = 0.0;
          if (uCloudDetail > 0.0) {
            vec3 finePos1 = pos * uCloudScale * 0.4 + vec3(25.0, 0.0, 75.0);
            vec3 finePos2 = pos * uCloudScale * 0.8 + vec3(10.0, 0.0, 50.0);
            vec3 finePos3 = pos * uCloudScale * 1.5 + vec3(5.0, 0.0, 30.0);
            
            float fine1 = noise(finePos1 + vec3(timeScale * 1.1, 0.0, timeScale * 0.9));
            float fine2 = noise(finePos2 + vec3(timeScale * 1.3, 0.0, timeScale * 1.1));
            float fine3 = noise(finePos3 + vec3(timeScale * 1.5, 0.0, timeScale * 1.2));
            
            // Progressive detail - more octaves at higher settings
            fineDetail = fine1 * 0.5;
            fineDetail += fine2 * 0.3 * smoothstep(0.3, 0.5, uCloudDetail);
            fineDetail += fine3 * 0.2 * smoothstep(0.6, 0.8, uCloudDetail);
            fineDetail /= (0.5 + 0.3 * smoothstep(0.3, 0.5, uCloudDetail) + 0.2 * smoothstep(0.6, 0.8, uCloudDetail));
          }
          
          // Blend: base shapes + fine detail on top
          float detailAmount = uCloudDetail * 0.5;  // How much fine detail to add
          float cloudValue = baseCloud * (1.0 - detailAmount * 0.3) + fineDetail * detailAmount;
          
          // Add noise-based variation to band compression
          float compressionNoise = noise(vec3(pos.x * 0.1, pos.z * 0.1, r * 0.15));
          float localCompression = uBandCompression * (0.7 + compressionNoise * 0.6);
          
          // Cloud affects both thickness and density - more pronounced
          float localThickness = baseThickness * (1.0 + (cloudValue - 0.5) * cloudStrength * 1.2);
          
          // Vertical falloff with variable compression
          float yNorm = (y * localCompression) / localThickness;
          float verticalFalloff = exp(-yNorm * yNorm * 0.5);
          if (verticalFalloff < 0.001) return vec4(0.0);
          
          // Edge transparency - thinner at cloud boundaries
          float edgeTransparency = 1.0;
          if (uEdgeFalloff > 0.0) {
            float cloudEdge = abs(cloudValue - 0.5) * 2.0;  // 0 at cloud center, 1 at edges
            edgeTransparency = mix(1.0, 1.0 - cloudEdge * 0.7, uEdgeFalloff);
          }
          
          float outerFade = smoothstep(outerRadius, outerRadius * 0.92, r);
          
          // Orbital streaks - concentric rings with subtle variation
          float streakFreq = uDiskStreaks;
          
          // Large scale noise to add subtle variation
          float streakNoise = noise(vec3(pos.x * 0.05, pos.z * 0.05, r * 0.08));
          
          // Streaks based on radius (concentric rings) with slight angular wobble
          float rPerturbed = r + (streakNoise - 0.5) * 0.3;
          
          // Blur affects streak sharpness - higher blur = softer sine waves
          float streakBlur = uDiskBlur;
          float streak1Raw = sin(rPerturbed * streakFreq * 0.8) * 0.5 + 0.5;
          float streak2Raw = sin(rPerturbed * streakFreq * 0.5 + 1.5) * 0.5 + 0.5;
          
          // Hermite smoothing
          float streak1 = streak1Raw * streak1Raw * (3.0 - 2.0 * streak1Raw);
          float streak2 = streak2Raw * streak2Raw * (3.0 - 2.0 * streak2Raw);
          
          // Blur reduces streak contrast
          streak1 = mix(streak1, 0.5, streakBlur * 0.8);
          streak2 = mix(streak2, 0.5, streakBlur * 0.8);
          
          // Mix streaks - strong contrast
          float streakMix = streak1 * 0.65 + streak2 * 0.35;
          float pattern = 0.25 + streakMix * 0.75;
          
          // If streak count is 0, no pattern
          if (streakFreq < 0.5) pattern = 1.0;
          
          // Smooth inner edge fade - sharper to reduce banding
          float innerFade = smoothstep(DISK_INNER * 0.9, DISK_INNER * 1.3, r);
          
          // Density - 3D clouds create visible variation, with edge transparency
          float cloudVar = (cloudValue - 0.3) * cloudStrength + 0.7;
          cloudVar = clamp(cloudVar, 0.3, 1.0);
          float density = verticalFalloff * outerFade * innerFade * pattern * cloudVar * edgeTransparency;
          
          // VOLUMETRIC SELF-SHADOWING
          // Cast ray toward inner disk (light source) and accumulate occlusion
          float shadow = 0.0;
          float shadowMult = uShadowStrength * 2.0;  // Direct control, stronger
          
          if (shadowMult > 0.01) {
            vec3 lightDir = normalize(vec3(-pos.x, 0.0, -pos.z));  // Toward center
            float shadowDist = min(r - DISK_INNER, 3.0);
            float stepLen = shadowDist / 8.0;
            
            for (int i = 1; i <= 8; i++) {
              vec3 samplePos = pos + lightDir * stepLen * float(i);
              float sr = length(samplePos.xz);
              float sy = samplePos.y * uBandCompression;  // Apply band compression
              
              if (sr > DISK_INNER * 0.7 && sr < outerRadius) {
                float sRadialNorm = clamp((sr - DISK_INNER) / (outerRadius - DISK_INNER), 0.0, 1.0);
                float sBaseThickness = mix(0.3, 0.6, sRadialNorm) * 1.3;
                
                // Sample 3D cloud at shadow position - base + detail
                vec3 sBasePos = samplePos * uCloudScale * 0.15;
                vec3 sBasePos2 = samplePos * uCloudScale * 0.08 + vec3(50.0, 0.0, 25.0);
                float sBaseCloud = noise(sBasePos + vec3(timeScale, 0.0, timeScale * 1.5)) * 0.6 +
                                  noise(sBasePos2 + vec3(timeScale * 0.7, 0.0, timeScale)) * 0.4;
                
                float sFineDetail = 0.0;
                if (uCloudDetail > 0.0) {
                  vec3 sFinePos = samplePos * uCloudScale * 0.4 + vec3(25.0, 0.0, 75.0);
                  sFineDetail = noise(sFinePos + vec3(timeScale * 1.1, 0.0, timeScale * 0.9));
                }
                float sDetailAmount = uCloudDetail * 0.5;
                float sCloud = sBaseCloud * (1.0 - sDetailAmount * 0.3) + sFineDetail * sDetailAmount;
                float sThickness = sBaseThickness * (1.0 + (sCloud - 0.5) * cloudStrength * 1.2);
                
                float sYnorm = sy / sThickness;
                float sDensity = exp(-sYnorm * sYnorm * 0.5);
                
                shadow += sDensity * stepLen * 1.0;
              }
            }
            shadow = clamp(shadow * shadowMult, 0.0, 0.85);
          }
          
          // INTENSE inner glow - key to the Interstellar look, softer falloff
          float innerGlow = exp(-(r - DISK_INNER) * 0.4) * 3.0;
          // Reduced radial brightness variation to minimize edge-on banding
          float brightness = (1.8 / (radialNorm * 0.6 + 0.4) + innerGlow) * uDiskBrightness;
          
          // Doppler - one side much brighter, synced with disk rotation
          float doppler = sin(orbit) * 0.7 / sqrt(r + 0.4);
          
          // Colors like Interstellar - more uniform to reduce edge-on banding
          vec3 innerColor = vec3(1.0, 0.88, 0.75);    // bright warm white
          vec3 midColor = vec3(0.95, 0.75, 0.5);       // golden orange
          vec3 outerColor = vec3(0.85, 0.6, 0.35);    // softer orange-brown
          vec3 darkColor = vec3(0.5, 0.3, 0.15);     // darker for variation
          vec3 shadowColor = vec3(0.05, 0.02, 0.01); // nearly black for deep shadows
          
          // More gradual color transition
          vec3 baseColor = mix(innerColor, outerColor, radialNorm * 0.7);
          
          // Apply 3D cloud variation to color - more visible
          float cloudColorVar = (cloudValue - 0.5) * cloudStrength;
          baseColor = mix(baseColor, darkColor, max(0.0, -cloudColorVar) * 0.5);
          baseColor = mix(baseColor, innerColor, max(0.0, cloudColorVar) * 0.3);
          
          // Apply pattern to color for visible streaks
          baseColor = mix(darkColor, baseColor, pattern);
          
          // Apply volumetric shadow - very visible
          baseColor = mix(baseColor, shadowColor, shadow);
          
          // Doppler color shifts
          vec3 color = baseColor;
          color = mix(color, vec3(1.0, 0.95, 0.95), max(0.0, doppler) * 0.3);
          color = mix(color, vec3(1.0, 0.5, 0.2), max(0.0, -doppler) * 0.25);
          
          return vec4(color * brightness * density, density);
        }
        
        void main() {
          vec2 uv = vUv;
          float aspect = iResolution.x / iResolution.y;
          
          // SKYBOX - camera at origin, look around freely
          vec3 eyepos = vec3(0.0, 0.0, -uBlackHoleDistance);
          
          // Ray direction from screen UV
          vec3 eyevec = normalize(vec3((uv * 2.0 - 1.0) * vec2(aspect, 1.0), 2.2));
          
          // Mouse controls which direction you're looking (not camera position)
          vec2 mousePos = iMouse.xy / iResolution.xy;
          if (iMouse.x == 0.0) mousePos = vec2(0.5, 0.5);
          
          float yaw = (mousePos.x - 0.5) * PI * 2.0;    // full 360 look
          float pitch = (mousePos.y - 0.5) * PI * 0.8;  // up/down look
          
          // Only rotate the view direction, not the camera position
          mat3 viewRot = rotateY(yaw) * rotateX(pitch);
          eyevec = viewRot * eyevec;
          
          // Disk tilt - more edge-on
          mat3 diskTilt = rotateX(uDiskTilt);
          
          // Ray marching state
          vec3 rayPos = eyepos;
          vec3 rayDir = eyevec;
          
          vec3 color = vec3(0.0);
          float alpha = 0.0;
          bool captured = false;
          float closestApproach = 1000.0;
          
          if (uBlackHoleEnabled > 0.5) {
            // Black hole rendering
            float baseStepSize = 0.05 + uBlackHoleDistance * 0.003;
            
            // Jitter ray start based on ray direction to break up banding
            float jitter = fract(sin(dot(rayDir.xy, vec2(12.9898, 78.233))) * 43758.5453);
            rayPos += rayDir * baseStepSize * jitter * 0.5;
            
            for (int i = 0; i < ITERATIONS; i++) {
              float dist = length(rayPos);
              closestApproach = min(closestApproach, dist);
              
              // Event horizon check FIRST
              if (dist < SCHWARZSCHILD) {
                captured = true;
                break;
              }
              
              // Adaptive step size - much smaller near disk plane
              vec3 diskPos = inverse(diskTilt) * rayPos;
              float diskY = abs(diskPos.y);
              float diskR = length(diskPos.xz);
              float nearDisk = (diskR > DISK_INNER * 0.5 && diskR < DISK_OUTER * uDiskThickness * 1.2) ? 1.0 : 0.0;
              float stepSize = baseStepSize * mix(1.0, 0.15, nearDisk * exp(-diskY * diskY * 1.0));
              
              // Gravitational deflection - strong for wrap
              float warpStrength = 3.0 * SCHWARZSCHILD / (dist * dist);
              vec3 toCenter = -normalize(rayPos);
              rayDir = normalize(rayDir + toCenter * warpStrength * stepSize);
              
              // Step the ray
              rayPos += rayDir * stepSize;
              
              // Sample accretion disk
              diskPos = inverse(diskTilt) * rayPos;
              vec4 diskSample = sampleDisk(diskPos, iTime);
              
              if (diskSample.a > 0.001) {
                // Accumulate volumetric - very smooth blending
                float contribution = diskSample.a * stepSize * 2.0;
                color += diskSample.rgb * contribution * (1.0 - alpha);
                alpha += contribution * (1.0 - alpha) * 0.5;
                if (alpha > 0.99) break;
              }
              
              // Escaped
              if (dist > uBlackHoleDistance * 1.5) break;
            }
            
            // Photon ring - softer glow
            if (!captured) {
              float ringDist = abs(closestApproach - PHOTON_SPHERE);
              float ring = exp(-ringDist * ringDist * 40.0) * 0.5;
              color += vec3(1.0, 0.92, 0.85) * ring;
            }
            
            // For captured rays, keep any disk color accumulated, just add black background
            if (captured && alpha < 1.0) {
              alpha = 1.0;
            }
          }
          
          // Background: stars (only if not captured)
          if (!captured && alpha < 1.0) {
            vec3 starColor;
            float starBrightness = stars(rayDir, iTime, starColor);
            color += starColor * (1.0 - alpha);
          }
          
          // Bloom - controllable intensity
          float lum = dot(color, vec3(0.299, 0.587, 0.114));
          vec3 bloom = color * smoothstep(0.2, 0.8, lum) * uBloomIntensity;
          color += bloom;
          
          // Tone mapping - adjusted for brightness
          color = color / (color + 0.4);
          color = pow(color, vec3(0.88));
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    const quad = new THREE.Mesh(geometry, material);
    scene.add(quad);
    materialRef.current = material;
    
    // Initialize to center
    const centerX = containerRef.current.clientWidth / 2;
    const centerY = containerRef.current.clientHeight / 2;
    mouseRef.current = { x: centerX, y: centerY };
    lockedPosRef.current = { x: centerX, y: centerY };
    material.uniforms.iMouse.value.set(centerX, centerY, 0, 0);

    const handleMouseMove = (e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left;
      const newY = rect.height - (e.clientY - rect.top);
      mouseRef.current = { x: newX, y: newY };
    };
    containerRef.current.addEventListener('mousemove', handleMouseMove);

    const clock = new THREE.Clock();
    let frameId;
    
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      material.uniforms.iTime.value = clock.getElapsedTime();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      renderer.setSize(w, h);
      material.uniforms.iResolution.value.set(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      containerRef.current?.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, []);

  // Update uniforms when controls change
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uStarSize.value = starSize;
      materialRef.current.uniforms.uTwinkleIntensity.value = twinkleIntensity;
      materialRef.current.uniforms.uTwinkleSpeed.value = twinkleSpeed;
      materialRef.current.uniforms.uMoveSpeed.value = moveSpeed;
      materialRef.current.uniforms.uStreakLength.value = streakLength;
      materialRef.current.uniforms.uStarDensity.value = starDensity;
      materialRef.current.uniforms.uBlackHoleDistance.value = blackHoleDistance;
      materialRef.current.uniforms.uBlackHoleEnabled.value = blackHoleEnabled ? 1.0 : 0.0;
      materialRef.current.uniforms.uRotateSkybox.value = rotateSkybox ? 1.0 : 0.0;
      materialRef.current.uniforms.uDiskStreaks.value = diskStreaks;
      materialRef.current.uniforms.uDiskBlur.value = diskBlur;
      materialRef.current.uniforms.uBloomIntensity.value = bloomIntensity;
      materialRef.current.uniforms.uDiskBrightness.value = diskBrightness;
      materialRef.current.uniforms.uCloudScale.value = cloudScale;
      materialRef.current.uniforms.uCloudDensity.value = cloudDensity;
      materialRef.current.uniforms.uCloudDetail.value = cloudDetail;
      materialRef.current.uniforms.uShadowStrength.value = shadowStrength;
      materialRef.current.uniforms.uCloudSpeed.value = cloudSpeed;
      materialRef.current.uniforms.uStreakSpeed.value = streakSpeed;
      materialRef.current.uniforms.uDiskTilt.value = diskTilt;
      materialRef.current.uniforms.uBandCompression.value = bandCompression;
      materialRef.current.uniforms.uDiskThickness.value = diskThickness;
      materialRef.current.uniforms.uEdgeFalloff.value = edgeFalloff;
    }
  }, [starSize, twinkleIntensity, twinkleSpeed, moveSpeed, streakLength, starDensity, blackHoleDistance, blackHoleEnabled, rotateSkybox, diskStreaks, diskBlur, bloomIntensity, diskBrightness, cloudScale, cloudDensity, cloudDetail, shadowStrength, cloudSpeed, streakSpeed, diskTilt, bandCompression, diskThickness, edgeFalloff]);

  return (
    <div className="w-full h-screen bg-black relative">
      <div ref={containerRef} className="w-full h-full" />
      
      {/* Top button bar */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={exportSettings}
          className="bg-gray-800 bg-opacity-70 text-white px-3 py-1 rounded text-sm hover:bg-opacity-90"
        >
          Export
        </button>
        <button
          onClick={importSettings}
          className="bg-gray-800 bg-opacity-70 text-white px-3 py-1 rounded text-sm hover:bg-opacity-90"
        >
          Import
        </button>
        <button
          onClick={resetCamera}
          className="bg-gray-800 bg-opacity-70 text-white px-3 py-1 rounded text-sm hover:bg-opacity-90"
        >
          Reset Camera
        </button>
        <button
          onClick={toggleLock}
          className={`px-3 py-1 rounded text-sm ${movementLocked ? 'bg-red-700 bg-opacity-90' : 'bg-gray-800 bg-opacity-70'} text-white hover:bg-opacity-90`}
        >
          {movementLocked ? '🔒 Locked' : '🔓 Unlocked'}
        </button>
        <button
          onClick={() => setShowControls(!showControls)}
          className="bg-gray-800 bg-opacity-70 text-white px-3 py-1 rounded text-sm hover:bg-opacity-90"
        >
          {showControls ? 'Hide' : 'Show'}
        </button>
      </div>
      
      {/* Control panel */}
      {showControls && (
        <div className="absolute top-16 right-4 bg-gray-900 bg-opacity-85 text-white p-4 rounded-lg w-64 text-sm max-h-[80vh] overflow-y-auto">
          <h3 className="font-bold mb-3 text-center">Controls</h3>
          
          <div className="space-y-3">
            {/* Toggles */}
            <div className="border-b border-gray-700 pb-3 mb-2 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={blackHoleEnabled}
                  onChange={(e) => setBlackHoleEnabled(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Black Hole Enabled</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rotateSkybox}
                  onChange={(e) => setRotateSkybox(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Rotate Skybox (vs Travel)</span>
              </label>
            </div>
            
            <div className="border-b border-gray-700 pb-2 mb-2">
              <label className="block mb-1 font-semibold">Black Hole Distance: {blackHoleDistance.toFixed(0)}</label>
              <input
                type="range"
                min="30"
                max="200"
                step="5"
                value={blackHoleDistance}
                onChange={(e) => setBlackHoleDistance(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            {/* Disk Appearance */}
            <div className="border-b border-gray-700 pb-2 mb-2">
              <p className="font-semibold mb-2">Disk Appearance</p>
              
              <div className="mb-2">
                <label className="block mb-1 text-xs">Disk Tilt: {diskTilt.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="0.8"
                  step="0.02"
                  value={diskTilt}
                  onChange={(e) => setDiskTilt(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-2">
                <label className="block mb-1 text-xs">Band Compression: {bandCompression.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.3"
                  max="3"
                  step="0.1"
                  value={bandCompression}
                  onChange={(e) => setBandCompression(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-2">
                <label className="block mb-1 text-xs">Disk Thickness: {diskThickness.toFixed(2)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="2.5"
                  step="0.1"
                  value={diskThickness}
                  onChange={(e) => setDiskThickness(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-2">
                <label className="block mb-1 text-xs">Edge Falloff: {edgeFalloff.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={edgeFalloff}
                  onChange={(e) => setEdgeFalloff(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-2">
                <label className="block mb-1 text-xs">Streak Count: {diskStreaks.toFixed(0)}</label>
                <input
                  type="range"
                  min="0"
                  max="8"
                  step="1"
                  value={diskStreaks}
                  onChange={(e) => setDiskStreaks(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-2">
                <label className="block mb-1 text-xs">Rotation Speed: {streakSpeed.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="3"
                  step="0.1"
                  value={streakSpeed}
                  onChange={(e) => setStreakSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-2">
                <label className="block mb-1 text-xs">Blur: {diskBlur.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={diskBlur}
                  onChange={(e) => setDiskBlur(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-2">
                <label className="block mb-1 text-xs">Brightness: {diskBrightness.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="3"
                  step="0.1"
                  value={diskBrightness}
                  onChange={(e) => setDiskBrightness(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-xs">Bloom: {bloomIntensity.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={bloomIntensity}
                  onChange={(e) => setBloomIntensity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            
            {/* Cloud Controls */}
            <div className="border-b border-gray-700 pb-2 mb-2">
              <p className="font-semibold mb-2">Cloud Effects</p>
              
              <div className="mb-2">
                <label className="block mb-1 text-xs">Cloud Scale: {cloudScale.toFixed(1)}</label>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.5"
                  value={cloudScale}
                  onChange={(e) => setCloudScale(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-2">
                <label className="block mb-1 text-xs">Cloud Density: {cloudDensity.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.05"
                  value={cloudDensity}
                  onChange={(e) => setCloudDensity(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-2">
                <label className="block mb-1 text-xs">Cloud Detail: {cloudDetail.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={cloudDetail}
                  onChange={(e) => setCloudDetail(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div className="mb-2">
                <label className="block mb-1 text-xs">Shadow Strength: {shadowStrength.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.05"
                  value={shadowStrength}
                  onChange={(e) => setShadowStrength(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="block mb-1 text-xs">Cloud Speed: {cloudSpeed.toFixed(2)}</label>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="0.2"
                  value={cloudSpeed}
                  onChange={(e) => setCloudSpeed(parseFloat(e.target.value))}
                  className="w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="block mb-1">Star Size: {starSize.toFixed(1)}</label>
              <input
                type="range"
                min="0.2"
                max="3"
                step="0.1"
                value={starSize}
                onChange={(e) => setStarSize(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block mb-1">Star Density: {starDensity.toFixed(1)}</label>
              <input
                type="range"
                min="0.2"
                max="2"
                step="0.1"
                value={starDensity}
                onChange={(e) => setStarDensity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block mb-1">Twinkle Intensity: {twinkleIntensity.toFixed(1)}</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={twinkleIntensity}
                onChange={(e) => setTwinkleIntensity(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block mb-1">Twinkle Speed: {twinkleSpeed.toFixed(1)}</label>
              <input
                type="range"
                min="0"
                max="3"
                step="0.1"
                value={twinkleSpeed}
                onChange={(e) => setTwinkleSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block mb-1">Movement Speed: {moveSpeed.toFixed(1)}</label>
              <input
                type="range"
                min="0"
                max="5"
                step="0.1"
                value={moveSpeed}
                onChange={(e) => setMoveSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div>
              <label className="block mb-1">Streak Length: {streakLength.toFixed(1)}</label>
              <input
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={streakLength}
                onChange={(e) => setStreakLength(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

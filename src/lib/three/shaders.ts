/**
 * GLSL shaders for the hero scene.
 * Keep shader source here so artists/devs can tweak looks without touching scene logic.
 */

/** 3D simplex noise + fbm (Ashima Arts / Stefan Gustavson, MIT). */
export const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1./289.))*289.;}
vec4 mod289(vec4 x){return x-floor(x*(1./289.))*289.;}
vec4 permute(vec4 x){return mod289(((x*34.)+1.)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1./6.,1./3.);const vec4 D=vec4(0.,.5,1.,2.);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.,i1.z,i2.z,1.))+i.y+vec4(0.,i1.y,i2.y,1.))+i.x+vec4(0.,i1.x,i2.x,1.));
  float n_=.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.+1.;vec4 s1=floor(b1)*2.+1.;vec4 sh=-step(h,vec4(0.));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.);m=m*m;
  return 42.*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
float fbm(vec3 p){float a=.5,f=0.;for(int i=0;i<5;i++){f+=a*snoise(p);p*=2.03;a*=.5;}return f;}
`;

/** Fullscreen nebula background — ember halo follows the asteroid, cool dust far away. */
export const nebulaVertex = /* glsl */ `varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}`;
export const nebulaFragment = NOISE + /* glsl */ `
      varying vec2 vUv; uniform float uTime,uScroll; uniform vec2 uRes,uFocus,uMouse;
      void main(){
        vec2 uv=vUv; float asp=uRes.x/uRes.y;
        vec2 p=(uv-.5)*vec2(asp,1.);
        vec2 f=(uFocus-.5)*vec2(asp,1.);
        float t=uTime*.03;
        float n=fbm(vec3(p*1.4+vec2(0.,uScroll*.6),t));
        float n2=fbm(vec3(p*2.6-n*.6,t*1.4+4.));
        float d=length(p-f);
        vec3 col=vec3(.043,.039,.035);
        float glow=exp(-d*d*2.6);
        col+=vec3(1.,.36,.12)*glow*(.10+.12*n2);                 // ember halo around the asteroid
        col+=vec3(1.,.55,.25)*smoothstep(.15,.9,n)*.05*(1.-d*.6);  // warm dust
        col+=vec3(.25,.35,.55)*smoothstep(.2,.9,n2)*.06*smoothstep(.2,1.4,d); // cool far nebula
        float m=length(p-(uMouse-.5)*vec2(asp,1.));
        col+=vec3(1.,.4,.15)*.035*exp(-m*m*8.);
        col*=1.-smoothstep(.6,1.6,length(p*vec2(.8,1.1)));     // vignette
        gl_FragColor=vec4(col,1.);
      }`;

/** Asteroid: noise-displaced icosphere, faceted lighting, molten veins, fresnel rim. */
export const asteroidVertex = NOISE + /* glsl */ `
      uniform float uTime; varying vec3 vW; varying vec3 vP; varying float vD;
      void main(){
        vec3 n=normalize(position);
        float d=fbm(n*1.25)*.32 + (1.-abs(snoise(n*3.2)))*.07 - .04;
        // craters
        float c=snoise(n*2.1+7.);
        d-=smoothstep(.55,.8,c)*.09;
        vec3 p=n*(1.+d)*vec3(1.18,.92,1.);
        vD=d; vP=p;
        vec4 w=modelMatrix*vec4(p,1.); vW=w.xyz;
        gl_Position=projectionMatrix*viewMatrix*w;
      }`;
export const asteroidFragment = NOISE + /* glsl */ `
      uniform float uTime,uHeat,uDim; uniform vec3 uEmber;
      varying vec3 vW; varying vec3 vP; varying float vD;
      void main(){
        vec3 N=normalize(cross(dFdx(vW),dFdy(vW)));
        vec3 V=normalize(cameraPosition-vW);
        vec3 L=normalize(vec3(-.55,.75,.65));
        vec3 L2=normalize(vec3(.9,-.35,-.4));
        float spk=snoise(vP*22.)*.5+.5;
        vec3 rock=mix(vec3(.10,.09,.085),vec3(.42,.38,.34),smoothstep(-.12,.26,vD));
        rock*=.82+.3*spk;
        float diff=max(dot(N,L),0.);
        float back=max(dot(N,L2),0.);
        float fres=pow(1.-max(dot(N,V),0.),2.6);
        vec3 col=rock*(.06+diff*1.25*vec3(1.,.94,.86));
        col+=uEmber*back*.55;
        col+=uEmber*fres*(.6+uHeat*1.4);
        // molten veins
        float v=1.-abs(snoise(vP*1.9+vec3(0.,uTime*.03,0.)));
        float vein=smoothstep(.93,.995,v)*smoothstep(.1,-.08,vD);
        float pulse=.7+.3*sin(uTime*1.6+vP.y*4.);
        col+=mix(uEmber,vec3(1.,.8,.4),vein)*vein*(1.4+uHeat*2.)*pulse;
        col*=uDim;
        gl_FragColor=vec4(col,1.);
      }`;

/** Twinkling point sprites (stars + ring dust). */
export const dotVertex = /* glsl */ `attribute float seed;uniform float uTime,uSize;varying float vA;
      void main(){vec4 mv=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*mv;
      vA=.35+.65*(.5+.5*sin(uTime*(1.+seed*2.)+seed*40.));gl_PointSize=uSize*(.4+seed)*(6./-mv.z);}`;
export const dotFragment = /* glsl */ `uniform vec3 uColor;varying float vA;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(uColor,vA*smoothstep(.5,0.,d));}`;

(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))e(a);new MutationObserver(a=>{for(const i of a)if(i.type==="childList")for(const n of i.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&e(n)}).observe(document,{childList:!0,subtree:!0});function s(a){const i={};return a.integrity&&(i.integrity=a.integrity),a.referrerPolicy&&(i.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?i.credentials="include":a.crossOrigin==="anonymous"?i.credentials="omit":i.credentials="same-origin",i}function e(a){if(a.ep)return;a.ep=!0;const i=s(a);fetch(a.href,i)}})();class x{constructor(){this.storageKey="food_verification_store_v4",this.themeKey="food_verification_theme",this.currentUserIdKey="food_verification_current_user_id",this.isLoggedInKey="food_verification_is_logged_in",this.listeners=[],this.state=this.loadState()}loadState(){try{const t=localStorage.getItem(this.storageKey);if(t){const s=JSON.parse(t);if(s.users&&s.checks&&s.complaints){let e=s.users.find(a=>a.role==="admin"||a.id==="user-admin"||a.username==="siva45"||a.username==="admin");return e?(e.id=e.id||"user-admin",e.username=e.username||"admin",e.password=e.password||"admin",e.role="admin",e.name="Administrator",e.email=e.email||"admin@foodcheck.ai"):s.users.unshift({id:"user-admin",username:"admin",name:"Administrator",email:"admin@foodcheck.ai",password:"admin",role:"admin",tag:"Platform Administrator",avatar:"👑",color:"#8b5cf6"}),s}}}catch(t){console.warn("Could not load stored data",t)}return{users:[{id:"user-admin",username:"admin",name:"Administrator",email:"admin@foodcheck.ai",password:"admin",role:"admin",tag:"Platform Administrator",avatar:"👑",color:"#8b5cf6"},{id:"user-siva",username:"siva",name:"siva",email:"siva.prediction@gmail.com",password:"password123",role:"user",tag:"prediction",avatar:"S",color:"#00a86b"},{id:"user-priya",username:"priya",name:"Priya Sharma",email:"priya.k@gmail.com",password:"password123",role:"user",tag:"Quality Inspector",avatar:"P",color:"#0284c7"},{id:"user-alex",username:"alex",name:"Alex Miller",email:"alex.m@gmail.com",password:"password123",role:"user",tag:"Receiving Staff",avatar:"A",color:"#f59e0b"}],checks:[{id:"chk-101",userId:"user-siva",userName:"siva",type:"Quantity",productName:"Tomatoes",unit:"kg",expectedQty:2,receivedQty:1.6,difference:-.4,diffPercent:-20,status:"Shortage",timestamp:new Date(Date.now()-36e5*2).toISOString(),notes:"Received 1.6 kg instead of ordered 2.0 kg (-400g)"},{id:"chk-102",userId:"user-siva",userName:"siva",type:"Quality",productName:"Honeycrisp Apples",qualityScore:96,qualityStatus:"Fresh",image:"/images/fresh_apple.jpg",timestamp:new Date(Date.now()-36e5*18).toISOString(),notes:"Crisp taut skin, high firmness, optimal freshness."},{id:"chk-103",userId:"user-priya",userName:"Priya Sharma",type:"Quality",productName:"Cavendish Banana",qualityScore:54,qualityStatus:"Overripe / Brown Spots",image:"/images/overripe_banana.jpg",timestamp:new Date(Date.now()-36e5*24).toISOString(),notes:"Advanced sugar spots, softening skin. Best for baking."},{id:"chk-104",userId:"user-alex",userName:"Alex Miller",type:"Quantity",productName:"Basmati Rice 5kg bag",unit:"kg",expectedQty:5,receivedQty:4.2,difference:-.8,diffPercent:-16,status:"Shortage",timestamp:new Date(Date.now()-36e5*48).toISOString(),notes:"Shortage of 800g on delivery package."}],complaints:[{id:"cmp-201",userId:"user-siva",userName:"siva",vendor:"InstaGrocer App",orderId:"ORD-8921-X",issueType:"Short Quantity",productName:"Tomatoes",shortage:"0.4 kg missing (20% deficit)",claimAmount:"$2.50",status:"Pending Review",date:new Date(Date.now()-36e5*1).toISOString(),description:"Package contained only 1.6kg of tomatoes against the paid order of 2.0kg."},{id:"cmp-202",userId:"user-alex",userName:"Alex Miller",vendor:"FreshMart Wholesaler",orderId:"ORD-4412-B",issueType:"Short Quantity",productName:"Basmati Rice 5kg bag",shortage:"0.8 kg missing",claimAmount:"$4.20",status:"Under Investigation",date:new Date(Date.now()-36e5*36).toISOString(),description:"Deficit of 800g detected upon weigh scale inspection."}]}}saveState(){try{localStorage.setItem(this.storageKey,JSON.stringify(this.state))}catch(t){console.warn("Could not save data",t)}this.notify()}subscribe(t){return this.listeners.push(t),()=>{this.listeners=this.listeners.filter(s=>s!==t)}}notify(){this.listeners.forEach(t=>t(this.state))}isLoggedIn(){const t=localStorage.getItem(this.isLoggedInKey)==="true",s=this.getCurrentUserId(),e=s?this.state.users.find(a=>a.id===s):null;return t&&!!e}getCurrentUserId(){return localStorage.getItem(this.currentUserIdKey)||null}getCurrentUser(){const t=this.getCurrentUserId();return t&&this.state.users.find(s=>s.id===t)||null}switchUser(t){const s=this.state.users.find(e=>e.id===t);return s?(localStorage.setItem(this.currentUserIdKey,s.id),localStorage.setItem(this.isLoggedInKey,"true"),this.notify(),{success:!0,user:s}):{success:!1,error:"User not found"}}authenticateUser(t,s){const e=t.trim().toLowerCase(),a=s.trim(),i=this.state.users.find(r=>r.role==="admin"||r.id==="user-admin"||r.username&&r.username.toLowerCase()==="siva45");if(i){const r=e==="admin"||e==="siva45"||e==="admin@foodcheck.ai"||e==="siva45@foodcheck.ai"||e===(i.username||"").toLowerCase()||e===(i.email||"").toLowerCase(),o=a===i.password||a==="admin"||a==="admin123"||a==="siva@2006";if(r&&o)return localStorage.setItem(this.currentUserIdKey,i.id),localStorage.setItem(this.isLoggedInKey,"true"),this.notify(),{success:!0,user:i}}const n=this.state.users.find(r=>(r.username.toLowerCase()===e||r.email.toLowerCase()===e)&&r.password===a);return n?(localStorage.setItem(this.currentUserIdKey,n.id),localStorage.setItem(this.isLoggedInKey,"true"),this.notify(),{success:!0,user:n}):{success:!1,error:"Invalid username/email or password."}}authenticateAdmin(t,s){const e=t.trim().toLowerCase(),a=s.trim(),i=this.state.users.find(n=>n.role==="admin"||n.id==="user-admin"||n.username&&n.username.toLowerCase()==="siva45");if(i){const n=e==="admin"||e==="siva45"||e==="admin@foodcheck.ai"||e==="siva45@foodcheck.ai"||e===(i.username||"").toLowerCase()||e===(i.email||"").toLowerCase(),r=a===i.password||a==="admin"||a==="admin123"||a==="siva@2006";if(n&&r)return localStorage.setItem(this.currentUserIdKey,i.id),localStorage.setItem(this.isLoggedInKey,"true"),this.notify(),{success:!0,admin:i}}return{success:!1,error:"Invalid admin credentials. Use username: admin (or siva45) and password: admin (or siva@2006)."}}registerUser({name:t,username:s,email:e,password:a}){const i=e.trim().toLowerCase(),n=(s||i.split("@")[0]).trim().toLowerCase(),r=a.trim();if(this.state.users.some(l=>l.email.toLowerCase()===i||l.username.toLowerCase()===n))return{success:!1,error:"An account with this email or username already exists."};const o={id:"user-"+Date.now(),username:n,name:t.trim(),email:i,password:r,role:"user",tag:"Staff Inspector",avatar:t.trim()[0].toUpperCase(),color:"#059669"};return this.state.users.push(o),this.saveState(),localStorage.setItem(this.currentUserIdKey,o.id),localStorage.setItem(this.isLoggedInKey,"true"),this.notify(),{success:!0,user:o}}logout(){localStorage.setItem(this.isLoggedInKey,"false"),localStorage.removeItem(this.currentUserIdKey),this.notify()}isAdmin(){const t=this.getCurrentUser();return t&&t.role==="admin"}getAllUsers(){return this.state.users}getChecksForCurrentUser(t=null){const s=this.getCurrentUser();return s?s.role==="admin"?t&&t!=="all"?this.state.checks.filter(e=>e.userId===t):this.state.checks:this.state.checks.filter(e=>e.userId===s.id):[]}getComplaintsForCurrentUser(t=null){const s=this.getCurrentUser();return s?s.role==="admin"?t&&t!=="all"?this.state.complaints.filter(e=>e.userId===t):this.state.complaints:this.state.complaints.filter(e=>e.userId===s.id):[]}addCheck(t){const s=this.getCurrentUser();if(!s)return null;const e={id:"chk-"+Date.now(),userId:s.id,userName:s.name,timestamp:new Date().toISOString(),...t};return this.state.checks.unshift(e),this.saveState(),e}deleteCheck(t){const s=this.getCurrentUser();s&&(s.role==="admin"?this.state.checks=this.state.checks.filter(e=>e.id!==t):this.state.checks=this.state.checks.filter(e=>e.id!==t&&e.userId===s.id),this.saveState())}addComplaint(t){const s=this.getCurrentUser();if(!s)return null;const e={id:"cmp-"+Date.now(),userId:s.id,userName:s.name,date:new Date().toISOString(),status:"Pending Review",...t};return this.state.complaints.unshift(e),this.saveState(),e}updateComplaintStatus(t,s,e=""){const a=this.state.complaints.find(i=>i.id===t);a&&(a.status=s,e&&(a.adminNote=e),this.saveState())}deleteComplaint(t){const s=this.getCurrentUser();s&&(s.role==="admin"?this.state.complaints=this.state.complaints.filter(e=>e.id!==t):this.state.complaints=this.state.complaints.filter(e=>e.id!==t&&e.userId===s.id),this.saveState())}getTheme(){return localStorage.getItem(this.themeKey)||"light"}setTheme(t){localStorage.setItem(this.themeKey,t),document.documentElement.setAttribute("data-theme",t),this.notify()}toggleTheme(){const t=this.getTheme()==="dark"?"light":"dark";return this.setTheme(t),t}getStats(t=null){const s=this.getChecksForCurrentUser(t),e=s.length,a=s.filter(r=>r.type==="Quantity"&&r.status==="Shortage"||r.type==="Quality"&&r.qualityScore<70||r.type==="Order"&&r.missingItemsCount>0).length,i=s.filter(r=>r.type==="Quality"&&typeof r.qualityScore=="number"),n=i.length>0?Math.round(i.reduce((r,o)=>r+o.qualityScore,0)/i.length)+"%":"—";return{totalChecks:e,issuesCount:a,avgQuality:n}}getAdminOrgStats(){const t=this.state.checks.length,s=this.state.users.filter(n=>n.role!=="admin").length,e=this.state.complaints.length,a=this.state.complaints.filter(n=>n.status==="Pending Review").length,i=this.state.complaints.reduce((n,r)=>{const o=r.claimAmount?r.claimAmount.replace(/[^0-9.]/g,""):"0";return n+(parseFloat(o)||0)},0).toFixed(2);return{totalTeamChecks:t,totalStaffMembers:s,totalComplaints:e,pendingComplaints:a,totalClaimMoney:`$${i}`}}}const c=new x;function w(m,t,s=""){return`
    <div class="password-input-wrapper">
      <input 
        type="password" 
        id="${m}" 
        class="custom-text-input ${s}" 
        placeholder="${t}" 
        autocomplete="off"
        required 
      />
      <button type="button" class="btn-password-toggle" data-target="${m}" title="Show password" aria-label="Toggle password visibility">
        <svg class="eye-icon eye-open" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
          <circle cx="12" cy="12" r="3"></circle>
        </svg>
        <svg class="eye-icon eye-closed hidden" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
          <line x1="1" y1="1" x2="23" y2="23"></line>
        </svg>
      </button>
    </div>
  `}class A{constructor(t={}){this.container=t.container,this.onLoginSuccess=t.onLoginSuccess||(()=>{}),this.onShowToast=t.onShowToast||(()=>{}),this.activeLoginTab="user",this.isRegistering=!1,this.errorMessage=""}mount(){this.render(),this.attachEvents()}render(){this.container.innerHTML=`
      <div class="login-portal-wrapper">
        <div class="login-portal-card">
          <!-- Logo & Platform Branding -->
          <div class="login-brand-header">
            <div class="login-brand-icon">🌿</div>
            <h1 class="login-app-title">Food Verification Platform</h1>
            <p class="login-app-subtitle">Secure access to verify food quantities, quality, and reports.</p>
          </div>

          <!-- Two Separate Login Pathway Tabs -->
          <div class="login-tab-switcher">
            <button class="login-tab-btn ${this.activeLoginTab==="user"?"active":""}" id="tab-user-login">
              <span>👤</span> User / Staff Login
            </button>
            <button class="login-tab-btn ${this.activeLoginTab==="admin"?"active":""}" id="tab-admin-login">
              <span>👑</span> Administrator Login
            </button>
          </div>

          ${this.errorMessage?`
            <div class="login-error-banner">
              <span>⚠️</span> <span>${this.errorMessage}</span>
            </div>
          `:""}

          <!-- Pathway 1: Regular User Login (Username & Password) -->
          <div class="login-pathway-content ${this.activeLoginTab==="user"?"":"hidden"}" id="user-login-section">
            ${this.isRegistering?`
              <!-- User Registration Form -->
              <form id="user-register-form" class="auth-form-card" autocomplete="off">
                <h4 class="form-subheading">Create New Staff Account</h4>
                <div class="form-input-group">
                  <label class="input-label-text" for="reg-name-input">Full Name</label>
                  <input type="text" id="reg-name-input" class="custom-text-input" placeholder="Enter your full name" autocomplete="off" required />
                </div>

                <div class="form-input-group">
                  <label class="input-label-text" for="reg-username-input">Username</label>
                  <input type="text" id="reg-username-input" class="custom-text-input" placeholder="Choose a username" autocomplete="off" required />
                </div>

                <div class="form-input-group">
                  <label class="input-label-text" for="reg-email-input">Email Address</label>
                  <input type="email" id="reg-email-input" class="custom-text-input" placeholder="Enter your email address" autocomplete="off" required />
                </div>

                <div class="form-input-group">
                  <label class="input-label-text" for="reg-password-input">Password</label>
                  ${w("reg-password-input","Create a secure password")}
                </div>

                <button type="submit" class="btn-primary-mint btn-login-submit">
                  <span>✨</span> Register & Sign In
                </button>

                <div class="form-toggle-footer">
                  <span>Already have an account?</span>
                  <button type="button" id="btn-toggle-signin" class="btn-link-action">Back to Sign In</button>
                </div>
              </form>
            `:`
              <!-- User Sign In Form -->
              <form id="user-login-form" class="auth-form-card" autocomplete="off">
                <div class="form-input-group">
                  <label class="input-label-text" for="user-identifier-input">Username or Email</label>
                  <input 
                    type="text" 
                    id="user-identifier-input" 
                    class="custom-text-input" 
                    placeholder="Enter your username or email" 
                    autocomplete="off"
                    required 
                  />
                </div>

                <div class="form-input-group">
                  <label class="input-label-text" for="user-password-input">Password</label>
                  ${w("user-password-input","Enter your password")}
                </div>

                <button type="submit" class="btn-primary-mint btn-login-submit">
                  <span>🔐</span> Sign In to My Account
                </button>

                <div class="form-toggle-footer">
                  <span>Don't have an account?</span>
                  <button type="button" id="btn-toggle-signup" class="btn-link-action">Register New Account</button>
                </div>
              </form>
            `}
          </div>

          <!-- Pathway 2: Administrator Login (Dedicated Admin Credentials) -->
          <div class="login-pathway-content ${this.activeLoginTab==="admin"?"":"hidden"}" id="admin-login-section">
            <div class="admin-login-box">
              <div class="admin-login-header">
                <div class="admin-crown-large">👑</div>
                <h3 class="admin-login-heading">Administrator Portal</h3>
                <p class="admin-login-sub">Enter administrator credentials to access the Organization Overseer Hub.</p>
              </div>

              <form id="admin-login-form" autocomplete="off">
                <div class="form-input-group">
                  <label class="input-label-text" for="admin-identifier-input">Admin Username or Email</label>
                  <input 
                    type="text" 
                    id="admin-identifier-input" 
                    class="custom-text-input" 
                    placeholder="Enter admin username" 
                    autocomplete="off"
                    required 
                  />
                </div>

                <div class="form-input-group">
                  <label class="input-label-text" for="admin-password-input">Admin Security Password</label>
                  ${w("admin-password-input","Enter admin password")}
                </div>

                <button type="submit" class="btn-admin-submit">
                  <span>👑 Sign In to Admin Overseer Hub</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    `}attachEvents(){const t=this.container.querySelector("#tab-user-login"),s=this.container.querySelector("#tab-admin-login");t&&t.addEventListener("click",()=>{this.activeLoginTab="user",this.errorMessage="",this.render(),this.attachEvents()}),s&&s.addEventListener("click",()=>{this.activeLoginTab="admin",this.errorMessage="",this.render(),this.attachEvents()});const e=this.container.querySelector("#btn-toggle-signup");e&&e.addEventListener("click",()=>{this.isRegistering=!0,this.errorMessage="",this.render(),this.attachEvents()});const a=this.container.querySelector("#btn-toggle-signin");a&&a.addEventListener("click",()=>{this.isRegistering=!1,this.errorMessage="",this.render(),this.attachEvents()}),this.container.querySelectorAll(".btn-password-toggle").forEach(l=>{l.addEventListener("click",d=>{d.preventDefault();const p=l.getAttribute("data-target"),u=this.container.querySelector(`#${p}`);if(!u)return;const v=l.querySelector(".eye-open"),g=l.querySelector(".eye-closed");u.type==="password"?(u.type="text",l.setAttribute("title","Hide password"),l.setAttribute("aria-label","Hide password"),v&&v.classList.add("hidden"),g&&g.classList.remove("hidden")):(u.type="password",l.setAttribute("title","Show password"),l.setAttribute("aria-label","Show password"),v&&v.classList.remove("hidden"),g&&g.classList.add("hidden")),u.focus()})});const n=this.container.querySelector("#user-login-form");n&&n.addEventListener("submit",l=>{l.preventDefault();const d=this.container.querySelector("#user-identifier-input").value.trim(),p=this.container.querySelector("#user-password-input").value.trim(),u=c.authenticateUser(d,p);u.success?(this.errorMessage="",this.onShowToast(`Welcome, ${u.user.name}! Accessing your account.`,"success"),this.onLoginSuccess(u.user)):(this.errorMessage=u.error,this.render(),this.attachEvents())});const r=this.container.querySelector("#user-register-form");r&&r.addEventListener("submit",l=>{l.preventDefault();const d=this.container.querySelector("#reg-name-input").value.trim(),p=this.container.querySelector("#reg-username-input").value.trim(),u=this.container.querySelector("#reg-email-input").value.trim(),v=this.container.querySelector("#reg-password-input").value.trim(),g=c.registerUser({name:d,username:p,email:u,password:v});g.success?(this.errorMessage="",this.onShowToast(`Account created for ${g.user.name}!`,"success"),this.onLoginSuccess(g.user)):(this.errorMessage=g.error,this.render(),this.attachEvents())});const o=this.container.querySelector("#admin-login-form");o&&o.addEventListener("submit",l=>{l.preventDefault();const d=this.container.querySelector("#admin-identifier-input").value.trim(),p=this.container.querySelector("#admin-password-input").value.trim(),u=c.authenticateAdmin(d,p);u.success?(this.errorMessage="",this.onShowToast("Authenticated as Administrator! Accessing Overseer Hub.","success"),this.onLoginSuccess(u.admin)):(this.errorMessage=u.error,this.render(),this.attachEvents())})}}class L{constructor(t={}){this.container=t.container,this.onNavigate=t.onNavigate||(()=>{})}mount(){this.render(),this.attachEvents()}render(){const t=c.getStats(),s=c.getChecksForCurrentUser().slice(0,3);this.container.innerHTML=`
      <div class="screen-view home-screen-view">
        <!-- Hero Green Card -->
        <div class="hero-banner-card">
          <div class="hero-badge">
            <span class="hero-badge-icon">🛡️</span>
            <span>Food Verification Platform</span>
          </div>
          <h2 class="hero-heading">Check what you<br/>actually received.</h2>
          <p class="hero-description">
            Verify food quantity, scan quality with AI, and build complaint reports — all in one place.
          </p>
        </div>

        <!-- 3 Stats Cards Row -->
        <div class="stats-cards-row">
          <!-- Card 1: Checks -->
          <div class="stat-box-card" id="stat-card-checks">
            <div class="stat-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div class="stat-number-val">${t.totalChecks}</div>
            <div class="stat-title-label">Checks</div>
          </div>

          <!-- Card 2: Issues Found -->
          <div class="stat-box-card" id="stat-card-issues">
            <div class="stat-icon-wrapper icon-wrap-growth">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            </div>
            <div class="stat-number-val">${t.issuesCount}</div>
            <div class="stat-title-label">Issues Found</div>
          </div>

          <!-- Card 3: Avg Quality -->
          <div class="stat-box-card" id="stat-card-quality">
            <div class="stat-icon-wrapper icon-wrap-camera">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                <circle cx="12" cy="13" r="4"/>
              </svg>
            </div>
            <div class="stat-number-val">${t.avgQuality}</div>
            <div class="stat-title-label">Avg Quality</div>
          </div>
        </div>

        <!-- Quality Trend Section -->
        <div class="content-section-card">
          <div class="section-title-row">
            <h3 class="section-main-title">Quality Trend</h3>
            <button class="section-link-btn" id="view-all-trend-btn">View All Records &rarr;</button>
          </div>
          
          <!-- Quality Distribution Bars -->
          <div class="trend-visual-container">
            <div class="trend-bar-col">
              <div class="trend-bar-fill fill-peak" style="height: 85%;"></div>
              <span class="trend-bar-label">Mon</span>
            </div>
            <div class="trend-bar-col">
              <div class="trend-bar-fill fill-good" style="height: 60%;"></div>
              <span class="trend-bar-label">Tue</span>
            </div>
            <div class="trend-bar-col">
              <div class="trend-bar-fill fill-peak" style="height: 95%;"></div>
              <span class="trend-bar-label">Wed</span>
            </div>
            <div class="trend-bar-col">
              <div class="trend-bar-fill fill-defect" style="height: 45%;"></div>
              <span class="trend-bar-label">Thu</span>
            </div>
            <div class="trend-bar-col">
              <div class="trend-bar-fill fill-peak" style="height: 90%;"></div>
              <span class="trend-bar-label">Fri</span>
            </div>
            <div class="trend-bar-col">
              <div class="trend-bar-fill fill-good" style="height: 75%;"></div>
              <span class="trend-bar-label">Sat</span>
            </div>
            <div class="trend-bar-col">
              <div class="trend-bar-fill fill-peak" style="height: 92%;"></div>
              <span class="trend-bar-label">Today</span>
            </div>
          </div>

          <div class="trend-legend-row">
            <span class="legend-item"><span class="legend-dot dot-peak"></span> Fresh / Optimal (&gt;80%)</span>
            <span class="legend-item"><span class="legend-dot dot-good"></span> Acceptable (60-80%)</span>
            <span class="legend-item"><span class="legend-dot dot-defect"></span> Issue / Defect (&lt;60%)</span>
          </div>
        </div>

        <!-- Quick Start Action Tiles -->
        <div class="content-section-card">
          <h3 class="section-main-title">Quick Verifications</h3>
          <div class="quick-tiles-grid">
            <button class="quick-action-tile" data-nav="quantity">
              <div class="tile-icon-bg bg-emerald">⚖️</div>
              <div class="tile-info">
                <strong>Check Quantity</strong>
                <span>Weigh or count grocery items vs order bill</span>
              </div>
              <span class="tile-arrow">&rsaquo;</span>
            </button>

            <button class="quick-action-tile" data-nav="quality">
              <div class="tile-icon-bg bg-mint">📷</div>
              <div class="tile-info">
                <strong>Scan Quality with AI</strong>
                <span>Instant freshness, defects, & shelf-life scan</span>
              </div>
              <span class="tile-arrow">&rsaquo;</span>
            </button>

            <button class="quick-action-tile" data-nav="order">
              <div class="tile-icon-bg bg-cyan">📋</div>
              <div class="tile-info">
                <strong>Verify Delivery Order</strong>
                <span>Multi-item grocery order verification</span>
              </div>
              <span class="tile-arrow">&rsaquo;</span>
            </button>
          </div>
        </div>

        <!-- Recent Records Activity Feed -->
        <div class="content-section-card">
          <div class="section-title-row">
            <h3 class="section-main-title">Recent Activity</h3>
            <button class="section-link-btn" data-nav="history">History</button>
          </div>

          <div class="recent-list">
            ${s.map(e=>`
              <div class="recent-item-card">
                <div class="recent-item-left">
                  <span class="recent-type-icon">${e.type==="Quantity"?"⚖️":"📷"}</span>
                  <div>
                    <strong class="recent-item-name">${e.productName}</strong>
                    <span class="recent-item-time">${new Date(e.timestamp).toLocaleDateString()} • ${e.type} Check</span>
                  </div>
                </div>
                <div class="recent-item-right">
                  ${e.type==="Quantity"?`
                    <span class="badge-status ${e.status==="Shortage"?"badge-shortage":"badge-match"}">
                      ${e.status==="Shortage"?`${e.difference}${e.unit}`:"Matched"}
                    </span>
                  `:`
                    <span class="badge-status ${e.qualityScore>=80?"badge-fresh":"badge-shortage"}">
                      ${e.qualityScore}% Quality
                    </span>
                  `}
                </div>
              </div>
            `).join("")}
          </div>
        </div>
      </div>
    `}attachEvents(){this.container.querySelectorAll("[data-nav]").forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-nav");this.onNavigate(a)})});const s=this.container.querySelector("#view-all-trend-btn");s&&s.addEventListener("click",()=>{this.onNavigate("history")})}}class q{constructor(t={}){this.container=t.container,this.onNavigate=t.onNavigate||(()=>{}),this.onShowToast=t.onShowToast||(()=>{}),this.activeUnit="kg",this.currentResult=null}mount(){this.render(),this.attachEvents()}render(){this.container.innerHTML=`
      <div class="screen-view quantity-screen-view">
        <!-- Page Title & Subtitle matching Screenshot 3 -->
        <div class="page-title-block">
          <h2 class="page-main-heading">Quantity Check</h2>
          <p class="page-sub-heading">Compare ordered vs. received quantity.</p>
        </div>

        <!-- Form Card Container matching Screenshot 3 -->
        <div class="form-surface-card">
          <!-- Food / Product Name -->
          <div class="form-input-group">
            <label class="input-label-text" for="qty-product-name">Food / Product Name</label>
            <input 
              type="text" 
              id="qty-product-name" 
              class="custom-text-input" 
              placeholder="e.g. Tomatoes, Rice 5kg bag..." 
              value="${this.currentResult?this.currentResult.productName:""}"
            />
          </div>

          <!-- Unit Selector Pills matching Screenshot 3 -->
          <div class="form-input-group">
            <label class="input-label-text">Unit</label>
            <div class="unit-pills-row" id="unit-pills-group">
              ${["kg","g","L","ml","units","pack"].map(t=>`
                <button type="button" class="unit-pill-btn ${this.activeUnit===t?"active":""}" data-unit="${t}">
                  ${t}
                </button>
              `).join("")}
            </div>
          </div>

          <!-- Expected Qty vs Received Qty side-by-side -->
          <div class="qty-inputs-row">
            <div class="form-input-group">
              <label class="input-label-text" for="qty-expected">Expected Qty</label>
              <input 
                type="number" 
                step="any" 
                id="qty-expected" 
                class="custom-text-input text-center" 
                placeholder="0" 
                value="${this.currentResult?this.currentResult.expectedQty:""}"
              />
            </div>
            <div class="form-input-group">
              <label class="input-label-text" for="qty-received">Received Qty</label>
              <input 
                type="number" 
                step="any" 
                id="qty-received" 
                class="custom-text-input text-center" 
                placeholder="0" 
                value="${this.currentResult?this.currentResult.receivedQty:""}"
              />
            </div>
          </div>

          <!-- Calculate Difference Button matching Screenshot 3 -->
          <button type="button" id="btn-calc-diff" class="btn-primary-mint">
            <span class="btn-icon-svg">⚖️</span>
            <span>Calculate Difference</span>
          </button>
        </div>

        <!-- Calculation Result Card (Conditional) -->
        <div id="qty-result-box" class="result-display-container ${this.currentResult?"":"hidden"}">
          ${this.currentResult?this.renderResultCard(this.currentResult):""}
        </div>
      </div>
    `}renderResultCard(t){const s=t.difference<0,e=t.difference===0;return t.difference>0,`
      <div class="analysis-result-card ${s?"border-shortage":"border-success"}">
        <div class="result-header-row">
          <span class="status-chip ${s?"badge-danger-soft":e?"badge-success-soft":"badge-info-soft"}">${s?"⚠️ Shortage / Missing Food Detected":e?"✅ Exact Match":"ℹ️ Surplus Delivered"}</span>
          <span class="result-timestamp">${new Date().toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span>
        </div>

        <div class="diff-numbers-grid">
          <div class="diff-box">
            <span class="diff-box-label">Expected</span>
            <strong class="diff-box-val">${t.expectedQty} ${t.unit}</strong>
          </div>
          <div class="diff-box">
            <span class="diff-box-label">Received</span>
            <strong class="diff-box-val">${t.receivedQty} ${t.unit}</strong>
          </div>
          <div class="diff-box highlight-diff">
            <span class="diff-box-label">Variance</span>
            <strong class="diff-box-val ${s?"text-red":e?"text-green":"text-blue"}">
              ${t.difference>0?"+":""}${t.difference} ${t.unit} (${t.diffPercent}%)
            </strong>
          </div>
        </div>

        ${s?`
          <div class="shortage-notice-box">
            <strong>Missing: ${Math.abs(t.difference)} ${t.unit} of ${t.productName}</strong>
            <p>You paid for items you did not receive. You can automatically generate a complaint report with estimated refund claim.</p>
          </div>
        `:""}

        <div class="result-actions-row">
          <button id="save-qty-check-btn" class="btn-secondary-outline">
            💾 Save to History
          </button>
          ${s?`
            <button id="escalate-complaint-btn" class="btn-danger-solid">
              📄 Build Complaint Report
            </button>
          `:""}
        </div>
      </div>
    `}attachEvents(){const t=this.container.querySelectorAll(".unit-pill-btn");t.forEach(e=>{e.addEventListener("click",()=>{this.activeUnit=e.getAttribute("data-unit"),t.forEach(a=>a.classList.remove("active")),e.classList.add("active")})}),this.container.querySelector("#btn-calc-diff").addEventListener("click",()=>{const e=this.container.querySelector("#qty-product-name"),a=this.container.querySelector("#qty-expected"),i=this.container.querySelector("#qty-received"),n=e.value.trim()||"Food Item",r=parseFloat(a.value),o=parseFloat(i.value);if(isNaN(r)||isNaN(o)){alert("Please enter valid numeric values for Expected Qty and Received Qty.");return}const l=parseFloat((o-r).toFixed(2)),d=r>0?parseFloat((l/r*100).toFixed(1)):0,p=l<0?"Shortage":l===0?"Match":"Surplus";this.currentResult={productName:n,unit:this.activeUnit,expectedQty:r,receivedQty:o,difference:l,diffPercent:d,status:p,notes:l<0?`Missing ${Math.abs(l)} ${this.activeUnit} of ${n} (${Math.abs(d)}% deficit)`:`Received exactly ${o} ${this.activeUnit}`};const u=this.container.querySelector("#qty-result-box");u.classList.remove("hidden"),u.innerHTML=this.renderResultCard(this.currentResult),this.attachResultEvents()})}attachResultEvents(){const t=this.container.querySelector("#save-qty-check-btn"),s=this.container.querySelector("#escalate-complaint-btn");t&&t.addEventListener("click",()=>{this.currentResult&&(c.addCheck({type:"Quantity",...this.currentResult}),this.onShowToast(`Saved ${this.currentResult.productName} quantity check to History!`,"success"),t.disabled=!0,t.textContent="✅ Saved")}),s&&s.addEventListener("click",()=>{this.currentResult&&(c.addCheck({type:"Quantity",...this.currentResult}),this.onNavigate("complaints",{productName:this.currentResult.productName,issueType:"Short Quantity",shortage:`${Math.abs(this.currentResult.difference)} ${this.currentResult.unit} missing`,description:`Ordered ${this.currentResult.expectedQty} ${this.currentResult.unit}, but only received ${this.currentResult.receivedQty} ${this.currentResult.unit}. Deficit of ${Math.abs(this.currentResult.difference)} ${this.currentResult.unit} (${Math.abs(this.currentResult.diffPercent)}%).`}))})}}const S=[{name:"Honeycrisp Apples",image:"/images/fresh_apple.jpg",score:96,status:"Fresh & Crisp",defects:"No visible bruising or oxidation detected. Cuticle wax layer intact.",shelfLife:"4–6 weeks refrigerated"},{name:"Overripe Cavendish Banana",image:"/images/overripe_banana.jpg",score:54,status:"Overripe / Advanced Browning",defects:"Extensive brown sugar freckles, softened peel structure. Best for baking.",shelfLife:"1–2 days room temp (freeze recommended)"},{name:"Fresh Atlantic Salmon",image:"/images/fresh_salmon.jpg",score:93,status:"Grade-A Fresh",defects:"Clean fat striations, elastic muscle tone, ocean-fresh translucency.",shelfLife:"1–2 days refrigerated"},{name:"Overripe Avocado",image:"/images/overripe_avocado.jpg",score:34,status:"Severe Browning / Spoilage Warning",defects:"Internal vascular oxidation, dark stringy streaks, high bacterial risk.",shelfLife:"Immediate consumption or discard"}];class E{constructor(t={}){this.container=t.container,this.onNavigate=t.onNavigate||(()=>{}),this.onShowToast=t.onShowToast||(()=>{}),this.selectedFood=S[0],this.currentStream=null,this.isCameraActive=!1,this.analysisResult=null,this.isAnalyzing=!1}mount(){this.render(),this.attachEvents()}render(){this.container.innerHTML=`
      <div class="screen-view quality-screen-view">
        <!-- Search / Food Name Input matching Screenshot 2 -->
        <div class="search-input-wrapper">
          <input 
            type="text" 
            id="quality-food-name" 
            class="custom-search-input" 
            placeholder="e.g. Strawberries, Bread loaf..." 
            value="${this.selectedFood?this.selectedFood.name:""}"
          />
        </div>

        <!-- Dashed Photo Upload / Capture Box matching Screenshot 2 -->
        <div class="photo-upload-dashed-box" id="quality-dashed-box">
          <!-- Video preview when camera active -->
          <video id="quality-camera-stream" class="video-stream-feed hidden" autoplay playsinline muted></video>

          <!-- Current Image Preview if selected -->
          <div id="image-preview-wrap" class="image-preview-wrap ${this.selectedFood&&!this.isCameraActive?"":"hidden"}">
            <img id="quality-preview-img" src="${this.selectedFood?this.selectedFood.image:""}" alt="Food preview" />
            <button id="clear-image-btn" class="btn-clear-photo" title="Remove photo">&times;</button>
          </div>

          <!-- Empty prompt placeholder matching Screenshot 2 -->
          <div id="photo-placeholder-prompt" class="photo-prompt-center ${this.selectedFood||this.isCameraActive?"hidden":""}">
            <div class="photo-icon-badge">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="8.5" cy="8.5" r="1.5"/>
                <polyline points="21 15 16 10 5 21"/>
              </svg>
            </div>
            <strong class="photo-prompt-title">Add a photo of your food</strong>
            <span class="photo-prompt-sub">AI will analyze visible freshness</span>
          </div>

          <input type="file" id="quality-file-input" accept="image/*" class="hidden" />
        </div>

        <!-- Camera and Gallery Buttons matching Screenshot 2 -->
        <div class="photo-action-buttons-row">
          <button type="button" id="btn-camera-trigger" class="btn-action-light">
            <span class="btn-action-icon">📷</span>
            <span id="camera-btn-label">Camera</span>
          </button>
          <button type="button" id="btn-gallery-trigger" class="btn-action-light">
            <span class="btn-action-icon">📤</span>
            <span>Gallery</span>
          </button>
        </div>

        <!-- Quick Sample Library (High-res Food presets) -->
        <div class="sample-library-strip">
          <span class="sample-label">Quick Test Foods:</span>
          <div class="sample-pills">
            ${S.map((t,s)=>`
              <button class="sample-pill-btn ${this.selectedFood&&this.selectedFood.name===t.name?"active":""}" data-idx="${s}">
                ${t.name.split(" ")[0]} (${t.score}%)
              </button>
            `).join("")}
          </div>
        </div>

        <!-- Analyze Quality Button matching Screenshot 2 -->
        <button type="button" id="btn-analyze-quality" class="btn-primary-mint">
          <span class="btn-icon-svg">✨</span>
          <span id="analyze-btn-text">Analyze Quality</span>
        </button>

        <!-- AI Quality Analysis Result Card -->
        <div id="quality-result-card" class="result-display-container ${this.analysisResult?"":"hidden"}">
          ${this.analysisResult?this.renderQualityResult(this.analysisResult):""}
        </div>
      </div>
    `}renderQualityResult(t){const s=t.score>=80,e=t.score>=60&&t.score<80,a=t.score<60;return`
      <div class="analysis-result-card ${a?"border-shortage":"border-success"}">
        <div class="result-header-row">
          <div>
            <span class="status-chip ${s?"badge-success-soft":e?"badge-warning-soft":"badge-danger-soft"}">${t.status}</span>
            <h4 class="result-food-heading">${t.name}</h4>
          </div>
          <div class="quality-score-badge-circle ${s?"circle-green":e?"circle-amber":"circle-red"}">
            <span class="circle-score-num">${t.score}</span>
            <span class="circle-score-label">/ 100</span>
          </div>
        </div>

        <div class="result-details-box">
          <div class="detail-row">
            <span class="detail-label">AI Visual Diagnosis:</span>
            <p class="detail-val">${t.defects}</p>
          </div>
          <div class="detail-row">
            <span class="detail-label">Safe Shelf Life:</span>
            <strong class="detail-val text-mint">${t.shelfLife}</strong>
          </div>
        </div>

        ${a?`
          <div class="shortage-notice-box">
            <strong>⚠️ Poor Food Quality Alert</strong>
            <p>This item exhibits significant spoilage or defects. You can attach this AI quality score and photo to an automated complaint report for a refund claim.</p>
          </div>
        `:""}

        <div class="result-actions-row">
          <button id="save-quality-check-btn" class="btn-secondary-outline">
            💾 Save to History
          </button>
          ${a?`
            <button id="escalate-quality-complaint-btn" class="btn-danger-solid">
              📄 Build Complaint Report
            </button>
          `:""}
        </div>
      </div>
    `}attachEvents(){const t=this.container.querySelector("#quality-file-input"),s=this.container.querySelector("#btn-gallery-trigger"),e=this.container.querySelector("#btn-camera-trigger"),a=this.container.querySelector("#btn-analyze-quality"),i=this.container.querySelector("#quality-dashed-box"),n=this.container.querySelector("#clear-image-btn");s&&s.addEventListener("click",()=>{t.click()}),i&&i.addEventListener("click",o=>{o.target.id!=="clear-image-btn"&&!this.selectedFood&&!this.isCameraActive&&t.click()}),n&&n.addEventListener("click",o=>{o.stopPropagation(),this.selectedFood=null,this.analysisResult=null,this.render(),this.attachEvents()}),t&&t.addEventListener("change",o=>{const l=o.target.files[0];if(l){const d=new FileReader;d.onload=p=>{const u=this.container.querySelector("#quality-food-name"),v=l.name.replace(/\.[^/.]+$/,"").replace(/[-_]/g," ")||"Food Sample";u&&(u.value=v),this.selectedFood={name:v,image:p.target.result,score:Math.floor(Math.random()*25)+72,status:"Good Freshness",defects:"Normal surface coloration and cellular structure.",shelfLife:"3–5 days refrigerated"},this.stopCamera(),this.analysisResult=null,this.render(),this.attachEvents()},d.readAsDataURL(l)}}),e&&e.addEventListener("click",()=>{this.isCameraActive?this.captureFromCamera():this.startCamera()}),this.container.querySelectorAll(".sample-pill-btn").forEach(o=>{o.addEventListener("click",()=>{const l=parseInt(o.getAttribute("data-idx"),10);this.selectedFood=S[l];const d=this.container.querySelector("#quality-food-name");d&&(d.value=this.selectedFood.name),this.stopCamera(),this.analysisResult=null,this.render(),this.attachEvents()})}),a&&a.addEventListener("click",()=>{if(!this.selectedFood&&!this.isCameraActive){alert("Please take a photo or select a food sample first.");return}this.isCameraActive&&this.captureFromCamera(),this.runAnalysis()}),this.attachResultEvents()}async startCamera(){const t=this.container.querySelector("#quality-camera-stream"),s=this.container.querySelector("#photo-placeholder-prompt"),e=this.container.querySelector("#image-preview-wrap"),a=this.container.querySelector("#camera-btn-label");try{this.currentStream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment",width:{ideal:640},height:{ideal:480}}}),t.srcObject=this.currentStream,t.classList.remove("hidden"),s&&s.classList.add("hidden"),e&&e.classList.add("hidden"),a&&(a.textContent="📸 Snap Photo"),this.isCameraActive=!0}catch(i){console.warn("Camera not available",i),alert("Camera could not be started. Using sample gallery or file upload.")}}stopCamera(){this.currentStream&&(this.currentStream.getTracks().forEach(t=>t.stop()),this.currentStream=null),this.isCameraActive=!1}captureFromCamera(){const t=this.container.querySelector("#quality-camera-stream");if(!t)return;const s=document.createElement("canvas");s.width=t.videoWidth||640,s.height=t.videoHeight||480,s.getContext("2d").drawImage(t,0,0,s.width,s.height);const a=s.toDataURL("image/jpeg");this.stopCamera(),this.selectedFood={name:this.container.querySelector("#quality-food-name").value.trim()||"Camera Captured Item",image:a,score:88,status:"Fresh & Verified",defects:"No significant surface spoilage detected.",shelfLife:"4–6 days refrigerated"},this.render(),this.attachEvents()}runAnalysis(){if(this.isAnalyzing)return;this.isAnalyzing=!0;const t=this.container.querySelector("#btn-analyze-quality"),s=this.container.querySelector("#analyze-btn-text");t.disabled=!0,s.textContent="Scanning with AI...",setTimeout(()=>{this.isAnalyzing=!1,t.disabled=!1,s.textContent="Analyze Quality";const e=this.container.querySelector("#quality-food-name").value.trim()||this.selectedFood.name;this.analysisResult={name:e,image:this.selectedFood.image,score:this.selectedFood.score,status:this.selectedFood.status,defects:this.selectedFood.defects,shelfLife:this.selectedFood.shelfLife};const a=this.container.querySelector("#quality-result-card");a.classList.remove("hidden"),a.innerHTML=this.renderQualityResult(this.analysisResult),this.attachResultEvents()},1200)}attachResultEvents(){const t=this.container.querySelector("#save-quality-check-btn"),s=this.container.querySelector("#escalate-quality-complaint-btn");t&&t.addEventListener("click",()=>{this.analysisResult&&(c.addCheck({type:"Quality",productName:this.analysisResult.name,qualityScore:this.analysisResult.score,qualityStatus:this.analysisResult.status,image:this.analysisResult.image,notes:`${this.analysisResult.defects} Shelf-life: ${this.analysisResult.shelfLife}`}),this.onShowToast(`Saved ${this.analysisResult.name} quality check to History!`,"success"),t.disabled=!0,t.textContent="✅ Saved")}),s&&s.addEventListener("click",()=>{this.analysisResult&&(c.addCheck({type:"Quality",productName:this.analysisResult.name,qualityScore:this.analysisResult.score,qualityStatus:this.analysisResult.status,image:this.analysisResult.image,notes:this.analysisResult.defects}),this.onNavigate("complaints",{productName:this.analysisResult.name,issueType:"Spoiled / Poor Quality",shortage:`Quality score ${this.analysisResult.score}/100`,description:`Food item was received in unacceptable spoiled condition. AI Quality scan diagnosed: "${this.analysisResult.defects}". Requesting full refund/replacement.`}))})}}class I{constructor(t={}){this.container=t.container,this.onNavigate=t.onNavigate||(()=>{}),this.onShowToast=t.onShowToast||(()=>{}),this.orderVendor="InstaGrocer Delivery",this.orderNumber="ORD-2026-981",this.items=[{id:1,name:"Roma Tomatoes (1 kg)",status:"received",price:"$2.99"},{id:2,name:"Whole Milk (1 Gallon)",status:"received",price:"$4.29"},{id:3,name:"Artisan Sourdough Bread",status:"missing",price:"$4.99"},{id:4,name:"Organic Bananas (Bunch)",status:"damaged",price:"$2.19"},{id:5,name:"Pasture-Raised Eggs (12pk)",status:"received",price:"$5.49"}]}mount(){this.render(),this.attachEvents()}render(){const t=this.items.length,s=this.items.filter(n=>n.status==="received").length,e=this.items.filter(n=>n.status==="missing").length,a=this.items.filter(n=>n.status==="damaged").length,i=t>0?Math.round(s/t*100):100;this.container.innerHTML=`
      <div class="screen-view order-screen-view">
        <div class="page-title-block">
          <h2 class="page-main-heading">Order Delivery Verification</h2>
          <p class="page-sub-heading">Verify complete grocery deliveries item-by-item.</p>
        </div>

        <!-- Order Header Card -->
        <div class="form-surface-card">
          <div class="order-meta-grid">
            <div class="form-input-group">
              <label class="input-label-text">Delivery Vendor / Store</label>
              <input type="text" id="order-vendor-input" class="custom-text-input" value="${this.orderVendor}" />
            </div>
            <div class="form-input-group">
              <label class="input-label-text">Order / Receipt ID</label>
              <input type="text" id="order-id-input" class="custom-text-input" value="${this.orderNumber}" />
            </div>
          </div>

          <!-- Fulfillment Progress Bar -->
          <div class="order-fulfillment-summary">
            <div class="fulfill-text-row">
              <span>Order Fulfillment Rate</span>
              <strong class="${i===100?"text-green":"text-amber"}">${i}% Complete</strong>
            </div>
            <div class="fulfill-track">
              <div class="fulfill-fill" style="width: ${i}%;"></div>
            </div>
            <div class="fulfill-tags-row">
              <span class="tag-status tag-rec">✅ ${s} Received</span>
              <span class="tag-status tag-mis">❌ ${e} Missing</span>
              <span class="tag-status tag-dam">⚠️ ${a} Damaged</span>
            </div>
          </div>
        </div>

        <!-- Item Checklist Table / List -->
        <div class="content-section-card">
          <div class="section-title-row">
            <h3 class="section-main-title">Delivery Items Checklist</h3>
            <button id="add-order-item-btn" class="btn-sm-text">+ Add Item</button>
          </div>

          <div class="order-items-list" id="order-items-container">
            ${this.items.map(n=>`
              <div class="order-item-row" data-id="${n.id}">
                <div class="order-item-left">
                  <strong class="item-name-text">${n.name}</strong>
                  <span class="item-price-text">${n.price}</span>
                </div>
                <div class="order-item-toggles">
                  <button class="status-btn btn-status-rec ${n.status==="received"?"active":""}" data-status="received" title="Received in good condition">
                    ✅ Received
                  </button>
                  <button class="status-btn btn-status-mis ${n.status==="missing"?"active":""}" data-status="missing" title="Missing from delivery">
                    ❌ Missing
                  </button>
                  <button class="status-btn btn-status-dam ${n.status==="damaged"?"active":""}" data-status="damaged" title="Damaged or spoiled">
                    ⚠️ Damaged
                  </button>
                </div>
              </div>
            `).join("")}
          </div>

          <div class="order-actions-bar">
            <button id="save-order-check-btn" class="btn-secondary-outline">
              💾 Save Order Check to History
            </button>
            ${e>0||a>0?`
              <button id="escalate-order-complaint-btn" class="btn-danger-solid">
                📄 File Order Complaint (${e+a} issues)
              </button>
            `:""}
          </div>
        </div>
      </div>
    `}attachEvents(){this.container.querySelectorAll(".status-btn").forEach(i=>{i.addEventListener("click",()=>{const n=i.closest(".order-item-row"),r=parseInt(n.getAttribute("data-id"),10),o=i.getAttribute("data-status"),l=this.items.find(d=>d.id===r);l&&(l.status=o,this.render(),this.attachEvents())})});const s=this.container.querySelector("#add-order-item-btn");s&&s.addEventListener("click",()=>{const i=prompt("Enter item name (e.g. Greek Yogurt 500g):");i&&i.trim()&&(this.items.push({id:Date.now(),name:i.trim(),status:"received",price:"$3.99"}),this.render(),this.attachEvents())});const e=this.container.querySelector("#save-order-check-btn");e&&e.addEventListener("click",()=>{const i=this.container.querySelector("#order-vendor-input").value,n=this.container.querySelector("#order-id-input").value,r=this.items.filter(l=>l.status==="missing"),o=this.items.filter(l=>l.status==="damaged");c.addCheck({type:"Order",productName:`${i} (${n})`,missingItemsCount:r.length+o.length,fulfillmentRate:Math.round(this.items.filter(l=>l.status==="received").length/this.items.length*100),notes:`${r.length} missing, ${o.length} damaged out of ${this.items.length} items.`}),this.onShowToast("Saved Order Verification to History!","success"),e.disabled=!0,e.textContent="✅ Saved"});const a=this.container.querySelector("#escalate-order-complaint-btn");a&&a.addEventListener("click",()=>{const i=this.container.querySelector("#order-vendor-input").value,n=this.container.querySelector("#order-id-input").value,r=this.items.filter(d=>d.status==="missing"),o=this.items.filter(d=>d.status==="damaged"),l=[...r.map(d=>`Missing: ${d.name} (${d.price})`),...o.map(d=>`Damaged/Spoiled: ${d.name} (${d.price})`)].join(`
`);this.onNavigate("complaints",{vendor:i,orderId:n,productName:`${r.length+o.length} Order Items`,issueType:"Missing & Damaged Items in Order",shortage:`${r.length} missing, ${o.length} damaged`,description:`Delivery Order #${n} from ${i} arrived with defective/missing items:
${l}`})})}}class T{constructor(t={}){this.container=t.container,this.onNavigate=t.onNavigate||(()=>{}),this.onShowToast=t.onShowToast||(()=>{}),this.activeFilter="All",this.searchQuery=""}mount(){this.render(),this.attachEvents()}render(){const t=this.getFilteredRecords();this.container.innerHTML=`
      <div class="screen-view history-screen-view">
        <!-- Page Heading matching Screenshot 4 -->
        <div class="page-title-block">
          <h2 class="page-main-heading">History</h2>
          <p class="page-sub-heading">All your food verification records.</p>
        </div>

        <!-- Search Bar matching Screenshot 4 -->
        <div class="search-input-wrapper">
          <div class="search-box-inner">
            <span class="search-box-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </span>
            <input 
              type="text" 
              id="history-search-input" 
              class="custom-search-input has-icon" 
              placeholder="Search records..." 
              value="${this.searchQuery}"
            />
          </div>
        </div>

        <!-- Filter Tabs matching Screenshot 4: All, Quantity, Quality, Order -->
        <div class="history-filter-pills-row">
          ${["All","Quantity","Quality","Order"].map(s=>`
            <button class="filter-pill-btn ${this.activeFilter===s?"active":""}" data-filter="${s}">
              ${s}
            </button>
          `).join("")}
        </div>

        <!-- Records Stream or Empty State matching Screenshot 4 -->
        <div class="history-records-container" id="history-list">
          ${t.length>0?`
            <div class="records-list-grid">
              ${t.map(s=>this.renderRecordCard(s)).join("")}
            </div>
          `:`
            <!-- Empty State matching Screenshot 4 -->
            <div class="empty-state-card">
              <div class="empty-icon-badge">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                  <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                  <line x1="9" y1="12" x2="15" y2="12"/>
                  <line x1="9" y1="16" x2="13" y2="16"/>
                </svg>
              </div>
              <strong class="empty-state-title">No records yet</strong>
              <span class="empty-state-sub">Perform a Quantity or Quality check to start recording data.</span>
            </div>
          `}
        </div>
      </div>
    `}renderRecordCard(t){const s=t.type==="Quantity",e=t.type==="Quality";t.type;const a=new Date(t.timestamp).toLocaleDateString([],{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"});let i="";return s?i=t.status==="Shortage"?`<span class="badge-status badge-shortage">Deficit ${t.difference} ${t.unit}</span>`:'<span class="badge-status badge-match">Exact Match</span>':e?i=t.qualityScore>=80?`<span class="badge-status badge-fresh">${t.qualityScore}% Fresh</span>`:`<span class="badge-status badge-shortage">${t.qualityScore}% Warning</span>`:i=`<span class="badge-status badge-info">${t.fulfillmentRate}% Fulfilled</span>`,`
      <div class="record-item-card" data-id="${t.id}">
        <div class="record-top-row">
          <div class="record-title-box">
            <span class="record-type-badge">${t.type}</span>
            <strong class="record-product-name">${t.productName}</strong>
          </div>
          <div class="record-meta-box">
            ${i}
            <button class="btn-delete-record" data-id="${t.id}" title="Delete Record">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="record-details-line">
          <span>${t.notes||"Verification recorded."}</span>
        </div>

        <div class="record-bottom-row">
          <span class="record-time-text">🕒 ${a}</span>
          ${t.status==="Shortage"||e&&t.qualityScore<70?`
            <button class="btn-sm-complaint" data-escalate-id="${t.id}">
              Report Issue &rarr;
            </button>
          `:""}
        </div>
      </div>
    `}getFilteredRecords(){let t=c.getChecksForCurrentUser();if(this.activeFilter!=="All"&&(t=t.filter(s=>s.type===this.activeFilter)),this.searchQuery){const s=this.searchQuery.toLowerCase();t=t.filter(e=>e.productName&&e.productName.toLowerCase().includes(s)||e.notes&&e.notes.toLowerCase().includes(s)||e.type&&e.type.toLowerCase().includes(s))}return t}attachEvents(){const t=this.container.querySelectorAll(".filter-pill-btn");t.forEach(e=>{e.addEventListener("click",()=>{this.activeFilter=e.getAttribute("data-filter"),t.forEach(a=>a.classList.remove("active")),e.classList.add("active"),this.render(),this.attachEvents()})});const s=this.container.querySelector("#history-search-input");s&&s.addEventListener("input",e=>{this.searchQuery=e.target.value;const a=this.container.querySelector("#history-list"),i=this.getFilteredRecords();i.length>0?a.innerHTML=`<div class="records-list-grid">${i.map(n=>this.renderRecordCard(n)).join("")}</div>`:a.innerHTML=`
            <div class="empty-state-card">
              <div class="empty-icon-badge">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <strong class="empty-state-title">No matching records found</strong>
              <span class="empty-state-sub">Try adjusting your search terms or filter.</span>
            </div>
          `,this.attachCardActions()}),this.attachCardActions()}attachCardActions(){this.container.querySelectorAll(".btn-delete-record").forEach(e=>{e.addEventListener("click",a=>{a.stopPropagation();const i=e.getAttribute("data-id");c.deleteCheck(i),this.onShowToast("Record deleted.","info"),this.render(),this.attachEvents()})}),this.container.querySelectorAll(".btn-sm-complaint").forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-escalate-id"),i=c.getChecksForCurrentUser().find(n=>n.id===a);i&&this.onNavigate("complaints",{productName:i.productName,issueType:i.type==="Quantity"?"Short Quantity":"Poor Quality",shortage:i.type==="Quantity"?`${i.difference} ${i.unit}`:`Score ${i.qualityScore}%`,description:i.notes})})})}}class R{constructor(t={}){this.container=t.container,this.onNavigate=t.onNavigate||(()=>{}),this.onShowToast=t.onShowToast||(()=>{}),this.prefillData=t.prefillData||null,this.showModal=!1}setPrefill(t){this.prefillData=t,this.showModal=!0,this.render(),this.attachEvents()}mount(){this.render(),this.attachEvents()}render(){const t=c.getComplaintsForCurrentUser();this.container.innerHTML=`
      <div class="screen-view complaints-screen-view">
        <!-- Page Title & Plus Button matching Screenshot 5 -->
        <div class="page-title-row-between">
          <div class="page-title-block">
            <h2 class="page-main-heading">Complaints</h2>
            <p class="page-sub-heading">Report food issues with details.</p>
          </div>

          <!-- Green Plus Button matching Screenshot 5 -->
          <button id="open-complaint-modal-btn" class="btn-green-plus" title="Report Issue">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
          </button>
        </div>

        <!-- Complaints Stream or Empty State matching Screenshot 5 -->
        <div class="complaints-content-area">
          ${t.length>0?`
            <div class="complaints-cards-grid">
              ${t.map(s=>this.renderComplaintCard(s)).join("")}
            </div>
          `:`
            <!-- Exact Empty State matching Screenshot 5 -->
            <div class="empty-complaint-card">
              <div class="empty-amber-badge">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="12" y1="18" x2="12" y2="12"/>
                  <line x1="12" y1="9" x2="12.01" y2="9"/>
                </svg>
              </div>
              <strong class="empty-state-title">No complaints filed yet</strong>
              <span class="empty-state-sub-action" id="empty-add-trigger">Tap + to report an issue</span>
            </div>
          `}
        </div>

        <!-- File Complaint Modal -->
        <div id="complaint-modal" class="modal-overlay ${this.showModal?"":"hidden"}">
          <div class="modal-surface-card">
            <div class="modal-header-line">
              <h3 class="modal-title">File Food Issue Complaint</h3>
              <button id="close-complaint-modal-btn" class="btn-modal-close">&times;</button>
            </div>

            <form id="file-complaint-form">
              <div class="form-input-group">
                <label class="input-label-text">Vendor / Store Name</label>
                <input 
                  type="text" 
                  id="cmp-vendor-input" 
                  class="custom-text-input" 
                  required 
                  placeholder="e.g. InstaGrocer, FreshSupermarket, Blinkit"
                  value="${this.prefillData&&this.prefillData.vendor?this.prefillData.vendor:"Local Grocery Delivery"}"
                />
              </div>

              <div class="form-row-2col">
                <div class="form-input-group">
                  <label class="input-label-text">Order / Bill ID</label>
                  <input 
                    type="text" 
                    id="cmp-order-input" 
                    class="custom-text-input" 
                    placeholder="e.g. ORD-8942-X"
                    value="${this.prefillData&&this.prefillData.orderId?this.prefillData.orderId:"ORD-"+Math.floor(1e3+Math.random()*9e3)}"
                  />
                </div>
                <div class="form-input-group">
                  <label class="input-label-text">Issue Category</label>
                  <select id="cmp-issue-type" class="custom-select-input">
                    <option value="Short Quantity" ${this.prefillData&&this.prefillData.issueType==="Short Quantity"?"selected":""}>Short Quantity / Missing Food</option>
                    <option value="Spoiled / Poor Quality" ${this.prefillData&&this.prefillData.issueType==="Spoiled / Poor Quality"?"selected":""}>Spoiled / Rotten Quality</option>
                    <option value="Expired Date">Expired Shelf-Life Date</option>
                    <option value="Wrong Item Delivered">Wrong Item Delivered</option>
                    <option value="Damaged Packaging">Damaged Packaging</option>
                  </select>
                </div>
              </div>

              <div class="form-row-2col">
                <div class="form-input-group">
                  <label class="input-label-text">Product Affected</label>
                  <input 
                    type="text" 
                    id="cmp-product-input" 
                    class="custom-text-input" 
                    required 
                    placeholder="e.g. Fresh Tomatoes"
                    value="${this.prefillData&&this.prefillData.productName?this.prefillData.productName:""}"
                  />
                </div>
                <div class="form-input-group">
                  <label class="input-label-text">Refund Claim Amount</label>
                  <input 
                    type="text" 
                    id="cmp-amount-input" 
                    class="custom-text-input" 
                    placeholder="e.g. $4.50"
                    value="${this.prefillData&&this.prefillData.claimAmount?this.prefillData.claimAmount:"$3.50"}"
                  />
                </div>
              </div>

              <div class="form-input-group">
                <label class="input-label-text">Issue Details / Evidence</label>
                <textarea 
                  id="cmp-desc-input" 
                  class="custom-textarea-input" 
                  rows="3" 
                  placeholder="Describe the discrepancy (e.g. weighed 1.6kg instead of 2kg ordered)..."
                >${this.prefillData&&this.prefillData.description?this.prefillData.description:""}</textarea>
              </div>

              <div class="modal-buttons-row">
                <button type="button" id="cancel-complaint-btn" class="btn-action-light">Cancel</button>
                <button type="submit" class="btn-primary-mint">Build & File Report</button>
              </div>
            </form>
          </div>
        </div>

        <!-- View Complaint Letter Modal -->
        <div id="letter-modal" class="modal-overlay hidden">
          <div class="modal-surface-card">
            <div class="modal-header-line">
              <h3 class="modal-title">Formal Complaint Letter</h3>
              <button id="close-letter-modal-btn" class="btn-modal-close">&times;</button>
            </div>
            <pre class="letter-pre-box" id="letter-text-content"></pre>
            <div class="modal-buttons-row">
              <button id="copy-letter-btn" class="btn-primary-mint">📋 Copy Letter Text</button>
            </div>
          </div>
        </div>
      </div>
    `}renderComplaintCard(t){const s=new Date(t.date).toLocaleDateString([],{month:"short",day:"numeric"});return`
      <div class="complaint-card-item" data-id="${t.id}">
        <div class="complaint-top-row">
          <div>
            <span class="badge-status badge-shortage">${t.issueType}</span>
            <h4 class="complaint-vendor-title">${t.vendor} • ${t.orderId}</h4>
          </div>
          <div class="complaint-status-pill pill-pending">
            ${t.status}
          </div>
        </div>

        <div class="complaint-body-line">
          <strong>Item: ${t.productName}</strong>
          <p>${t.description}</p>
        </div>

        <div class="complaint-footer-row">
          <span class="complaint-date">🕒 Filed ${s}</span>
          <div class="complaint-actions-wrap">
            <button class="btn-action-view-letter" data-letter-id="${t.id}">
              📄 View Letter
            </button>
            <button class="btn-delete-record" data-delete-id="${t.id}">
              🗑️
            </button>
          </div>
        </div>
      </div>
    `}attachEvents(){const t=this.container.querySelector("#open-complaint-modal-btn"),s=this.container.querySelector("#empty-add-trigger"),e=this.container.querySelector("#close-complaint-modal-btn"),a=this.container.querySelector("#cancel-complaint-btn"),i=this.container.querySelector("#complaint-modal"),n=this.container.querySelector("#file-complaint-form"),r=()=>{this.showModal=!0,i&&i.classList.remove("hidden")},o=()=>{this.showModal=!1,this.prefillData=null,i&&i.classList.add("hidden")};t&&t.addEventListener("click",r),s&&s.addEventListener("click",r),e&&e.addEventListener("click",o),a&&a.addEventListener("click",o),n&&n.addEventListener("submit",f=>{f.preventDefault();const b=this.container.querySelector("#cmp-vendor-input").value.trim(),h=this.container.querySelector("#cmp-order-input").value.trim(),y=this.container.querySelector("#cmp-issue-type").value,$=this.container.querySelector("#cmp-product-input").value.trim(),k=this.container.querySelector("#cmp-amount-input").value.trim(),C=this.container.querySelector("#cmp-desc-input").value.trim();c.addComplaint({vendor:b,orderId:h,issueType:y,productName:$,claimAmount:k,description:C}),this.onShowToast("Complaint report built and filed!","success"),o(),this.render(),this.attachEvents()});const l=this.container.querySelectorAll(".btn-action-view-letter"),d=this.container.querySelector("#letter-modal"),p=this.container.querySelector("#letter-text-content"),u=this.container.querySelector("#close-letter-modal-btn"),v=this.container.querySelector("#copy-letter-btn");l.forEach(f=>{f.addEventListener("click",()=>{const b=f.getAttribute("data-letter-id"),h=c.getComplaintsForCurrentUser().find(y=>y.id===b);if(h){const y=`FORMAL NOTICE OF FOOD VERIFICATION DISCREPANCY

To: Customer Support, ${h.vendor}
Date: ${new Date(h.date).toLocaleDateString()}
Order Reference: ${h.orderId}
Product Concerned: ${h.productName}
Claim Reason: ${h.issueType}
Refund Amount Requested: ${h.claimAmount}

Dear Customer Relations,

I am writing to officially report an issue with order #${h.orderId} received from ${h.vendor}.

Upon receipt, the order items were inspected using the Food Verification Platform:
- Discrepancy details: ${h.description}
- Stated issue: ${h.issueType} regarding ${h.productName}.

Under consumer protection guidelines for perishable foodstuffs, goods received must conform strictly to the quantity, quality, and condition paid for.

Please process a refund or credit adjustment of ${h.claimAmount} to the original payment method.

Thank you,
siva (Food Verification Platform User)`;p.textContent=y,d.classList.remove("hidden"),v.onclick=()=>{navigator.clipboard.writeText(y),this.onShowToast("Letter text copied to clipboard!","success")}}})}),u&&u.addEventListener("click",()=>{d.classList.add("hidden")}),this.container.querySelectorAll(".btn-delete-record").forEach(f=>{f.addEventListener("click",b=>{b.stopPropagation();const h=f.getAttribute("data-delete-id");c.deleteComplaint(h),this.onShowToast("Complaint removed.","info"),this.render(),this.attachEvents()})})}}class B{constructor(t={}){this.container=t.container,this.onNavigate=t.onNavigate||(()=>{}),this.onShowToast=t.onShowToast||(()=>{}),this.selectedUserFilter="all"}mount(){this.render(),this.attachEvents()}render(){const t=c.getAdminOrgStats(),s=c.getAllUsers().filter(i=>i.role!=="admin"),e=c.getChecksForCurrentUser(this.selectedUserFilter),a=c.getComplaintsForCurrentUser(this.selectedUserFilter);this.container.innerHTML=`
      <div class="screen-view admin-screen-view">
        <!-- Admin Overseer Header Banner -->
        <div class="admin-hero-card">
          <div class="admin-badge-row">
            <span class="admin-crown-badge">👑 ORGANIZATIONAL OVERSEER</span>
            <span class="live-dot-pulse">● Live Stream</span>
          </div>
          <h2 class="admin-hero-title">Admin Monitoring Center</h2>
          <p class="admin-hero-sub">
            Overseeing food verification checks, supplier shortage claims, and customer complaints across all staff accounts.
          </p>
        </div>

        <!-- Filter By Staff Member Bar -->
        <div class="admin-filter-bar-card">
          <label class="admin-filter-label" for="admin-user-filter">Filter Activity by Team Member:</label>
          <select id="admin-user-filter" class="custom-select-input admin-select">
            <option value="all" ${this.selectedUserFilter==="all"?"selected":""}>All Team Accounts (${c.state.users.length-1} staff members)</option>
            ${s.map(i=>`
              <option value="${i.id}" ${this.selectedUserFilter===i.id?"selected":""}>
                ${i.name} (${i.email}) — ${i.tag}
              </option>
            `).join("")}
          </select>
        </div>

        <!-- Org KPI Stats Grid -->
        <div class="admin-kpi-grid">
          <div class="stat-box-card">
            <div class="stat-icon-wrapper icon-wrap-growth">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div class="stat-number-val">${t.totalTeamChecks}</div>
            <div class="stat-title-label">Total Staff Checks</div>
          </div>

          <div class="stat-box-card">
            <div class="stat-icon-wrapper">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <div class="stat-number-val text-red">${t.pendingComplaints}</div>
            <div class="stat-title-label">Pending Complaints</div>
          </div>

          <div class="stat-box-card">
            <div class="stat-icon-wrapper icon-wrap-growth">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
              </svg>
            </div>
            <div class="stat-number-val text-green">${t.totalClaimMoney}</div>
            <div class="stat-title-label">Total Shortage Claims</div>
          </div>
        </div>

        <!-- Section 1: Staff Complaints Resolution Queue -->
        <div class="content-section-card">
          <div class="section-title-row">
            <h3 class="section-main-title">Complaints Resolution Queue (${a.length})</h3>
            <span class="text-subtle-hint">Admin controls to approve or resolve user dispute claims</span>
          </div>

          <div class="admin-complaints-list">
            ${a.length>0?a.map(i=>`
              <div class="admin-complaint-row" data-id="${i.id}">
                <div class="admin-row-header">
                  <div class="admin-user-pill">
                    <span class="mini-avatar">${(i.userName||"User")[0]}</span>
                    <strong>${i.userName}</strong>
                  </div>
                  <span class="badge-status ${i.status.includes("Approved")?"badge-match":i.status.includes("Pending")?"badge-shortage":"badge-info"}">
                    ${i.status}
                  </span>
                </div>

                <div class="admin-cmp-details">
                  <h4 class="admin-cmp-title">${i.vendor} • ${i.orderId}</h4>
                  <p class="admin-cmp-desc">${i.description}</p>
                  <div class="admin-cmp-meta-tags">
                    <span class="tag-issue">Issue: ${i.issueType}</span>
                    <span class="tag-claim">Claim Amount: <strong>${i.claimAmount}</strong></span>
                    <span class="tag-date">📅 ${new Date(i.date).toLocaleDateString()}</span>
                  </div>
                </div>

                <!-- Admin Action Controls -->
                <div class="admin-decision-buttons">
                  <button class="btn-admin-action btn-approve" data-id="${i.id}" data-action="Approved Refund">
                    ✅ Approve Refund
                  </button>
                  <button class="btn-admin-action btn-credit" data-id="${i.id}" data-action="Store Credit Issued">
                    💳 Store Credit
                  </button>
                  <button class="btn-admin-action btn-investigate" data-id="${i.id}" data-action="Under Investigation">
                    🔍 Investigate
                  </button>
                  <button class="btn-admin-action btn-resolve" data-id="${i.id}" data-action="Resolved">
                    ✔️ Close & Resolve
                  </button>
                </div>
              </div>
            `).join(""):`
              <div class="empty-state-card">
                <span class="empty-state-title">No complaints found for this selection</span>
              </div>
            `}
          </div>
        </div>

        <!-- Section 2: All Users Verification Audit Feed -->
        <div class="content-section-card">
          <div class="section-title-row">
            <h3 class="section-main-title">Staff Verification Activity Stream (${e.length})</h3>
          </div>

          <div class="admin-checks-table-wrap">
            <table class="admin-audit-table">
              <thead>
                <tr>
                  <th>Staff Member</th>
                  <th>Check Type</th>
                  <th>Product Name</th>
                  <th>Inspection Result</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                ${e.map(i=>`
                  <tr>
                    <td>
                      <span class="user-name-cell">
                        <span class="mini-avatar-inline">${(i.userName||"U")[0]}</span>
                        ${i.userName||"Staff"}
                      </span>
                    </td>
                    <td><span class="record-type-badge">${i.type}</span></td>
                    <td><strong>${i.productName}</strong></td>
                    <td>
                      ${i.type==="Quantity"?`
                        <span class="badge-status ${i.status==="Shortage"?"badge-shortage":"badge-match"}">
                          ${i.difference<0?`${i.difference} ${i.unit}`:"Match"}
                        </span>
                      `:`
                        <span class="badge-status ${i.qualityScore>=80?"badge-fresh":"badge-shortage"}">
                          ${i.qualityScore}% Quality
                        </span>
                      `}
                    </td>
                    <td><span class="text-subtle">${new Date(i.timestamp).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}</span></td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `}attachEvents(){const t=this.container.querySelector("#admin-user-filter");t&&t.addEventListener("change",e=>{this.selectedUserFilter=e.target.value,this.render(),this.attachEvents()}),this.container.querySelectorAll(".btn-admin-action").forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-id"),i=e.getAttribute("data-action");c.updateComplaintStatus(a,i),this.onShowToast(`Updated complaint status to "${i}"!`,"success"),this.render(),this.attachEvents()})})}}class M{constructor(t={}){this.container=t.container,this.onLogout=t.onLogout||(()=>{}),this.onUserSwitched=t.onUserSwitched||(()=>{}),this.onShowToast=t.onShowToast||(()=>{}),this.isOpen=!1}mount(){this.render(),this.attachEvents()}open(){this.isOpen=!0,this.render(),this.attachEvents()}close(){this.isOpen=!1;const t=document.getElementById("google-auth-modal");t&&t.classList.add("hidden")}render(){const t=c.getCurrentUser();if(!t)return;const s=t.role==="admin",e=c.getAllUsers();let a=document.getElementById("google-auth-modal");a?a.className=`modal-overlay ${this.isOpen?"":"hidden"}`:(a=document.createElement("div"),a.id="google-auth-modal",a.className=`modal-overlay ${this.isOpen?"":"hidden"}`,document.body.appendChild(a)),a.innerHTML=`
      <div class="modal-surface-card profile-security-card">
        <div class="google-modal-header">
          <div class="google-brand-row">
            <div class="google-user-avatar" style="background-color: ${t.color||"#00a86b"}; width: 44px; height: 44px; font-size: 1.25rem;">
              ${t.avatar}
            </div>
            <div>
              <h3 class="google-title">${t.name}</h3>
              <span class="${s?"badge-admin":"badge-role"}">${s?"👑 ADMIN OVERSEER":t.tag}</span>
            </div>
          </div>
          <button id="close-profile-modal-btn" class="btn-modal-close">&times;</button>
        </div>

        <div class="profile-details-list">
          <div class="profile-field-row">
            <span class="field-label">Current Active Account:</span>
            <strong class="field-val">@${t.username||t.name.toLowerCase()}</strong>
          </div>
          <div class="profile-field-row">
            <span class="field-label">Account Email:</span>
            <span class="field-val">${t.email}</span>
          </div>
          <div class="profile-field-row">
            <span class="field-label">Data Privacy:</span>
            <span class="field-val text-green">${s?"Full Organization Visibility":"Private to This Account Only"}</span>
          </div>
        </div>

        <!-- Multiple User Accounts in One Time Switcher -->
        <div class="auth-accounts-section">
          <div class="auth-accounts-title">
            <span>Switch Active Account</span>
            <span style="font-size: 0.72rem; font-weight: normal; color: var(--text-muted);">${e.length} available</span>
          </div>

          <div class="accounts-list-container">
            ${e.map(i=>{const n=i.id===t.id,r=i.role==="admin";return`
                <div class="auth-user-card ${n?"active-user":""}">
                  <div class="auth-user-left">
                    <div class="auth-user-avatar" style="background-color: ${i.color||"#059669"};">
                      ${i.avatar}
                    </div>
                    <div class="auth-user-details">
                      <span class="auth-user-name">${i.name} ${r?"👑":""}</span>
                      <span class="auth-user-sub">@${i.username}</span>
                    </div>
                  </div>
                  <div>
                    ${n?`
                      <span class="badge-active-tag">Active</span>
                    `:`
                      <button type="button" class="btn-switch-user" data-switch-id="${i.id}">
                        Switch
                      </button>
                    `}
                  </div>
                </div>
              `}).join("")}
          </div>

          <button type="button" id="btn-add-account" class="btn-add-account-outline">
            <span>➕</span> Log In / Add Another Account
          </button>
        </div>

        <div class="profile-modal-actions">
          <button id="modal-logout-btn" class="btn-danger-solid btn-full-width">
            <span>🚪</span> Sign Out of Account
          </button>
        </div>
      </div>
    `}attachEvents(){const t=document.getElementById("google-auth-modal");if(!t)return;const s=t.querySelector("#close-profile-modal-btn");s&&s.addEventListener("click",()=>this.close()),t.addEventListener("click",n=>{n.target===t&&this.close()}),t.querySelectorAll(".btn-switch-user").forEach(n=>{n.addEventListener("click",()=>{const r=n.getAttribute("data-switch-id"),o=c.switchUser(r);o.success&&(this.close(),this.onShowToast(`Switched account to ${o.user.name}`,"success"),this.onUserSwitched(o.user))})});const a=t.querySelector("#btn-add-account");a&&a.addEventListener("click",()=>{this.close(),c.logout(),this.onShowToast("Sign in or register another account.","info"),this.onLogout()});const i=t.querySelector("#modal-logout-btn");i&&i.addEventListener("click",()=>{this.close(),c.logout(),this.onLogout()})}}class F{constructor(){this.activeTab="home",this.views={},this.authModal=null,this.loginView=null,this.toastContainer=null}init(){const t=c.getTheme();document.documentElement.setAttribute("data-theme",t),this.checkSessionAndRender(),c.subscribe(()=>{this.checkSessionAndRender()})}checkSessionAndRender(){c.isLoggedIn()?this.renderAuthenticatedApp():this.renderLoginScreen()}renderLoginScreen(){const t=document.getElementById("app");t.innerHTML=`
      <div id="login-container"></div>
      <div id="toast-container" class="toast-msg-container"></div>
    `,this.toastContainer=document.getElementById("toast-container"),this.loginView=new A({container:document.getElementById("login-container"),onLoginSuccess:s=>{this.activeTab=s.role==="admin"?"admin":"home",this.checkSessionAndRender()},onShowToast:(s,e)=>this.showToast(s,e)}),this.loginView.mount()}renderAuthenticatedApp(){c.getCurrentUser();const t=c.isAdmin(),s=document.getElementById("app");s.innerHTML=`
      <!-- Top Platform Header matching Screenshots -->
      <header class="platform-header">
        <div class="header-inner-row">
          <!-- Left Slot: Profile (on Home) or Back Arrow + Title (on Subpages) -->
          <div class="header-left-slot" id="header-left-content"></div>

          <!-- Right Slot: Dark Mode Moon Icon, Account Switcher, and Logout -->
          <div class="header-right-slot">
            <button id="theme-toggle-btn" class="icon-header-btn" title="Toggle Dark/Light Mode">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            </button>
            <button id="profile-btn" class="icon-header-btn" title="Switch User Profile">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </button>
            <button id="logout-btn" class="btn-header-logout" title="Sign Out">
              <span>🚪</span> Logout
            </button>
          </div>
        </div>
      </header>

      <!-- Main Content Scroll Area -->
      <main class="main-content-scroll">
        <div id="view-home" class="screen-view active"></div>
        <div id="view-quantity" class="screen-view hidden"></div>
        <div id="view-quality" class="screen-view hidden"></div>
        <div id="view-order" class="screen-view hidden"></div>
        <div id="view-history" class="screen-view hidden"></div>
        <div id="view-complaints" class="screen-view hidden"></div>
        <div id="view-admin" class="screen-view hidden"></div>
      </main>

      <!-- Fixed Bottom Navigation Bar -->
      <nav class="fixed-bottom-nav">
        <div class="bottom-nav-inner" id="bottom-nav-inner-container"></div>
      </nav>

      <!-- Toast Container -->
      <div id="toast-container" class="toast-msg-container"></div>
    `,this.toastContainer=document.getElementById("toast-container"),this.renderBottomNav(),this.initViews(),this.attachNavigation(),this.updateHeader(),t&&this.activeTab!=="admin"?this.switchTab("admin"):!t&&this.activeTab==="admin"?this.switchTab("home"):this.switchTab(this.activeTab)}renderBottomNav(){const t=document.getElementById("bottom-nav-inner-container");if(!t)return;const s=c.isAdmin();t.innerHTML=`
      <button class="bottom-nav-item ${this.activeTab==="home"?"active":""}" data-tab="home">
        <div class="nav-icon-pill">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </div>
        <span class="nav-item-label">Home</span>
      </button>

      <button class="bottom-nav-item ${this.activeTab==="quantity"?"active":""}" data-tab="quantity">
        <div class="nav-icon-pill">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
            <path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/>
            <path d="M7 21h10"/>
            <path d="M12 3v18"/>
            <path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/>
          </svg>
        </div>
        <span class="nav-item-label">Quantity</span>
      </button>

      <button class="bottom-nav-item ${this.activeTab==="quality"?"active":""}" data-tab="quality">
        <div class="nav-icon-pill">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
        <span class="nav-item-label">Quality</span>
      </button>

      <button class="bottom-nav-item ${this.activeTab==="order"?"active":""}" data-tab="order">
        <div class="nav-icon-pill">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
            <line x1="9" y1="12" x2="15" y2="12"/>
            <line x1="9" y1="16" x2="13" y2="16"/>
          </svg>
        </div>
        <span class="nav-item-label">Order</span>
      </button>

      <button class="bottom-nav-item ${this.activeTab==="history"?"active":""}" data-tab="history">
        <div class="nav-icon-pill">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
            <polyline points="12 7 12 12 15 15"/>
          </svg>
        </div>
        <span class="nav-item-label">History</span>
      </button>

      <button class="bottom-nav-item ${this.activeTab==="complaints"?"active":""}" data-tab="complaints">
        <div class="nav-icon-pill">
          <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="12" y1="18" x2="12" y2="12"/>
            <line x1="12" y1="9" x2="12.01" y2="9"/>
          </svg>
        </div>
        <span class="nav-item-label">Complaints</span>
      </button>

      ${s?`
        <button class="bottom-nav-item ${this.activeTab==="admin"?"active":""}" data-tab="admin">
          <div class="nav-icon-pill" style="color: #8b5cf6;">
            👑
          </div>
          <span class="nav-item-label" style="color: #8b5cf6; font-weight: 700;">Admin Hub</span>
        </button>
      `:""}
    `,t.querySelectorAll(".bottom-nav-item").forEach(a=>{a.addEventListener("click",()=>{const i=a.getAttribute("data-tab");this.switchTab(i)})})}initViews(){const t=(e,a=null)=>{this.switchTab(e,a)},s=(e,a="info")=>{this.showToast(e,a)};this.authModal=new M({onUserSwitched:e=>{this.updateHeader(),this.renderBottomNav(),e.role==="admin"?this.switchTab("admin"):this.switchTab("home")},onLogout:()=>{this.checkSessionAndRender()},onShowToast:s}),this.authModal.mount(),this.views={home:new L({container:document.getElementById("view-home"),onNavigate:t}),quantity:new q({container:document.getElementById("view-quantity"),onNavigate:t,onShowToast:s}),quality:new E({container:document.getElementById("view-quality"),onNavigate:t,onShowToast:s}),order:new I({container:document.getElementById("view-order"),onNavigate:t,onShowToast:s}),history:new T({container:document.getElementById("view-history"),onNavigate:t,onShowToast:s}),complaints:new R({container:document.getElementById("view-complaints"),onNavigate:t,onShowToast:s}),admin:new B({container:document.getElementById("view-admin"),onNavigate:t,onShowToast:s})},Object.values(this.views).forEach(e=>e.mount())}attachNavigation(){const t=document.getElementById("theme-toggle-btn");t&&t.addEventListener("click",()=>{const a=c.toggleTheme();this.showToast(`Switched to ${a} mode`,"info")});const s=document.getElementById("profile-btn");s&&s.addEventListener("click",()=>{this.authModal.open()});const e=document.getElementById("logout-btn");e&&e.addEventListener("click",()=>{c.logout(),this.showToast("Logged out successfully","info")})}updateHeader(){const t=document.getElementById("header-left-content");if(!t)return;const s=c.getCurrentUser(),e=s.role==="admin";if(this.activeTab==="home"||this.activeTab==="admin"){t.innerHTML=`
        <div class="user-avatar-circle" style="background-color: ${s.color||"#00a86b"}; cursor: pointer;" id="avatar-click-target" title="Switch User Account">
          ${s.avatar}
        </div>
        <div class="user-text-meta" style="cursor: pointer;" id="meta-click-target" title="Switch User Account">
          <span class="user-name-title">${s.name}</span>
          <span class="user-sub-label" style="color: ${e?"#8b5cf6":"var(--brand-green-primary)"}">
            ${e?"👑 ADMIN OVERSEER":s.tag}
          </span>
        </div>
      `;const a=document.getElementById("avatar-click-target"),i=document.getElementById("meta-click-target"),n=()=>this.authModal.open();a&&a.addEventListener("click",n),i&&i.addEventListener("click",n)}else{const i={quantity:"Quantity",quality:"Quality",order:"Order",history:"History",complaints:"Complaints",admin:"Admin Overseer Hub"}[this.activeTab]||"Verification";t.innerHTML=`
        <button id="header-back-btn" class="subpage-back-arrow" title="Back to Home">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"/>
            <polyline points="12 19 5 12 12 5"/>
          </svg>
        </button>
        <h3 class="subpage-header-title">${i}</h3>
      `;const n=document.getElementById("header-back-btn");n&&n.addEventListener("click",()=>{this.switchTab(e?"admin":"home")})}}switchTab(t,s=null){if(!this.views[t])return;this.activeTab==="quality"&&t!=="quality"&&this.views.quality.stopCamera(),this.activeTab=t,document.querySelectorAll(".bottom-nav-item").forEach(i=>{i.getAttribute("data-tab")===t?i.classList.add("active"):i.classList.remove("active")});const a={home:document.getElementById("view-home"),quantity:document.getElementById("view-quantity"),quality:document.getElementById("view-quality"),order:document.getElementById("view-order"),history:document.getElementById("view-history"),complaints:document.getElementById("view-complaints"),admin:document.getElementById("view-admin")};Object.keys(a).forEach(i=>{a[i]&&(i===t?(a[i].classList.remove("hidden"),a[i].classList.add("active")):(a[i].classList.add("hidden"),a[i].classList.remove("active")))}),t==="complaints"&&s?this.views.complaints.setPrefill(s):(this.views[t].render(),this.views[t].attachEvents()),this.updateHeader(),window.scrollTo({top:0,behavior:"smooth"})}showToast(t,s="info"){if(!this.toastContainer)return;const e=document.createElement("div");e.className="toast-item";const a=s==="success"?"✅":s==="warn"?"⚠️":"ℹ️";e.innerHTML=`<span>${a}</span> <span>${t}</span>`,this.toastContainer.appendChild(e),setTimeout(()=>{e.style.opacity="0",e.style.transform="translateY(-10px)",e.style.transition="all 0.25s ease",setTimeout(()=>e.remove(),250)},2800)}}window.addEventListener("DOMContentLoaded",()=>{new F().init()});

<template>
  <div class="dashboard-page">
    <!-- TOP NAVBAR -->
    <header class="navbar">
      <div class="navbar-left">
        <h1 class="navbar-title">SCHOLARSHIP TRACKER</h1>
      </div>

      <div class="navbar-right">
        <span class="welcome">Welcome,</span>
        <span class="student">{{ studentName }}!</span>

        <!-- Notification Bell -->
        <button
          class="bell-btn"
          @click="openNotifications"
          title="Notifications"
        >
          <svg viewBox="0 0 24 24" class="bell-icon" fill="currentColor">
            <path
              d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6V11a7 7 0 1 0-14 0v5l-2 2v1h18v-1l-2-2Z"
            />
          </svg>

          <!-- badge -->
          <span v-if="notifCount > 0" class="notif-badge">
            {{ notifCount }}
          </span>
        </button>

        <!-- NOTIF DROPDOWN -->
        <div v-if="showNotifPanel" class="notif-panel">
          <div v-if="notifications.length === 0" class="notif-empty">
            No notifications.
          </div>

          <div
            v-for="n in notifications"
            :key="n.id"
            class="notif-item"
            :class="{ unread: !n.read_at }"
            @click="clickNotif(n)"
          >
            <div class="notif-title">{{ n.title }}</div>
            <div class="notif-body">{{ n.body }}</div>
            <small class="notif-type">{{ n.type }}</small>
          </div>
        </div>
      </div>
    </header>

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <h1>KA-SKO TRACKER</h1>
      <hr />

      <a
        class="nav-link"
        :class="{ active: activeSection === 'dashboard' }"
        @click="setSection('dashboard')"
      >
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8v-10h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
        Dashboard
      </a>

      <a
        class="nav-link"
        :class="{ active: activeSection === 'profile' }"
        @click="setSection('profile')"
      >
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z"/>
        </svg>
        Profile
      </a>

      <a
        class="nav-link"
        :class="{ active: activeSection === 'enlist' }"
        @click="setSection('enlist')"
      >
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
        </svg>
        Enlist Scholar
      </a>

      <hr />

      <a
        class="nav-link"
        :class="{ active: activeSection === 'gwa' }"
        @click="setSection('gwa')"
      >
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-7 14H8v-2h4v2zm0-4H8v-2h4v2zm0-4H8V7h4v2zm6 8h-4v-2h4v2zm0-4h-4v-2h4v2zm0-4h-4V7h4v2z"/>
        </svg>
        GWA Calculator
      </a>

      <a
        class="nav-link"
        :class="{ active: activeSection === 'predictor' }"
        @click="setSection('predictor')"
      >
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3L1 9l11 6 9-4.91V17h2V9L12 3zm0 10L4.12 9 12 5l7.88 4L12 13z"/>
        </svg>
        Scholar Predictor
      </a>

      <hr />

      <a class="nav-link" @click="doLogout">
        <svg class="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
          <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5a2 2 0 00-2 2v4h2V5h14v14H5v-4H3v4a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2z"/>
        </svg>
        Logout
      </a>
    </aside>

    <!-- MAIN CONTENT -->
    <main class="main">
      <!-- DASHBOARD SECTION -->
      <section class="content-section" v-show="activeSection === 'dashboard'">
        <h1>Analytics Dashboard</h1>

        <div class="cards">
          <div class="card">
            <h2>{{ totals.totalScholarships }}</h2>
            <h3>Total Scholarships</h3>
          </div>
          <div class="card">
            <h2>{{ totals.totalApplicants }}</h2>
            <h3>Total Applicants</h3>
          </div>
          <div class="card">
            <h2>{{ totals.totalSlots }}</h2>
            <h3>Total Slots</h3>
          </div>
          <div class="card">
            <h2>{{ totals.totalApproved }}</h2>
            <h3>Approved Applications</h3>
          </div>
        </div>

        <div class="charts-row">
          <div class="chart-box">
            <h2>Applicants per Scholarship</h2>
            <canvas ref="scholarshipChartRef"></canvas>
          </div>

          <div class="chart-box">
            <h2>Application Status Distribution</h2>
            <canvas ref="statusChartRef"></canvas>
          </div>
        </div>
      </section>

      <!-- PROFILE SECTION -->
      <section class="content-section" v-show="activeSection === 'profile'">
        <h1 class="section-title">Profile</h1>

        <div class="profile-card">
          <div class="profile-row">
            <span class="profile-label">Full Name</span>
            <span class="profile-value">{{ profile.full_name || "—" }}</span>
          </div>

          <div class="profile-row">
            <span class="profile-label">ID (username)</span>
            <span class="profile-value">{{ profile.username || "—" }}</span>
          </div>

          <div class="profile-row">
            <span class="profile-label">Campus</span>
            <span class="profile-value">{{ profile.campus || "—" }}</span>
          </div>

          <div class="profile-row" v-if="profile.active_scholarship">
  <span class="profile-label">Course & Year</span>
  <span class="profile-value">{{ profile.course_year || "—" }}</span>
</div>


          <div class="profile-row">
            <span class="profile-label">Active Scholarship</span>
            <span
              class="profile-value"
              :class="profile.active_scholarship ? 'ok' : 'none'"   >
              {{ profile.active_scholarship || "None Active Scholarship" }}
            </span>
          </div>
        </div>
      </section>

      <!-- ENLIST SECTION -->
      <section class="content-section" v-show="activeSection === 'enlist'">
        <h1>ENLIST NOW!</h1>

        <h2>Available Scholarships</h2>
        <table>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Slots</th>
            <th>Action</th>
          </tr>

          <tr v-for="s in scholarships" :key="s.id">
            <td>{{ s.name }}</td>
            <td>{{ s.description }}</td>
            <td>{{ s.slots }}</td>
            <td>
              <button
                v-if="s.eligible !== false"
                class="btn-green"
                :disabled="s.applied && s.applied_status === 'completed'"
                @click="applyScholarshipAction(s.id)"
              >
                {{ s.applied_status === 'completed' ? 'Completed' : 'Apply' }}
              </button>

              <button
                v-else
                class="btn-red"
                @click="checkEligibility(s.id)"
              >
                Check Eligibility
              </button>
            </td>
          </tr>
        </table>

        <h2>My Applications</h2>
        <table>
          <tr>
            <th>Scholarship</th>
            <th>Status</th>
            <th>Actions</th>
            <th>Submit</th>
          </tr>

          <tr v-for="app in myApplications" :key="app.id">
            <td>{{ app.name }}</td>

            <td :class="statusClass(app.status)">
              {{ formatStatus(app.status) }}
            </td>

            <td>
              <button class="btn-trash" @click="removeApplication(app.id)">
                🗑 Remove
              </button>
            </td>

            <td>
              <button
                :class="app.status === 'completed' ? 'btn-green' : 'btnsubmit'"
                :disabled="app.status === 'completed'"
                @click="submitRequirements(app.id)"
              >
                {{ app.status === 'completed' ? 'Submitted' : 'Submit requirements' }}
              </button>
            </td>
          </tr>
        </table>
      </section>

      <!-- GWA SECTION -->
      <section class="content-section gwa-section" v-show="activeSection === 'gwa'">
        <div class="gwa-header">
          <h2>KA-SKO GWA Calculator</h2>
          <p>Enter your subjects, units, and grades to compute your GWA.</p>
        </div>

        <div class="gwa-table-wrap">
          <table class="gwa-table">
            <thead>
              <tr>
                <th>Subject (optional)</th>
                <th>Units</th>
                <th>Grade</th>
                <th class="action-col">Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(row, i) in gwaRows" :key="i">
                <td>
                  <input
                    class="gwa-input"
                    type="text"
                    v-model="row.subject"
                    placeholder="Subject"
                  />
                </td>

                <td>
                  <input
                    class="gwa-input"
                    type="number"
                    min="1"
                    step="1"
                    v-model.number="row.units"
                    placeholder="Units"
                  />
                </td>

                <td>
                  <input
                    class="gwa-input"
                    type="number"
                    min="1"
                    max="5"
                    step="0.01"
                    v-model.number="row.grade"
                    placeholder="Grade"
                  />
                </td>

                <td class="action-col">
                  <button class="gwa-btn danger" @click="deleteRow(i)">Delete</button>
                </td>
              </tr>

              <tr v-if="gwaRows.length === 0">
                <td colspan="4" class="gwa-empty">
                  No subjects yet. Click <b>Add Subject</b> to start.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="gwa-actions">
          <button class="gwa-btn primary" @click="addRow">Add Subject</button>
          <button class="gwa-btn success" @click="calculateGWA">Calculate GWA</button>
          <button class="gwa-btn danger ghost" @click="clearAll">Clear All</button>
        </div>

        <div v-if="gwaResult" class="gwa-result-box">
          <h3>{{ gwaResult }}</h3>
          <p v-if="gwaMessage" :class="gwaMessageClass">
            {{ gwaMessage }}
          </p>
        </div>
      </section>

      <!-- PREDICTOR SECTION -->
      <section class="content-section" v-show="activeSection === 'predictor'">
        <h2>Scholar Predictor</h2>
        <p>Hook this to your predictor UI later.</p>
      </section>
    </main>
  </div>
</template>

<script>
import { onMounted, onBeforeUnmount, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import Chart from "chart.js/auto";
import {
  getTotals,
  getApplicantsPerScholarship,
  getStatusDistribution,
  getScholarships,
  getMyApplications,
  getProfile,
  applyScholarship,
  removeApplication as removeApplicationApi,
  logout,

  // ✅ NOTIF IMPORTS ONLY ADDED
  getNotifications,
  getUnreadNotifCount,
  markNotifRead,
} from "@/services/api";

export default {
  name: "DashboardView",
  setup() {
    const router = useRouter();

    // -------------------- NOTIFICATIONS --------------------
    const notifCount = ref(0);
    const notifications = ref([]);
    const showNotifPanel = ref(false);

    async function loadNotifs() {
      try {
        const c = await getUnreadNotifCount();
        notifCount.value = c.count || 0;

        notifications.value = await getNotifications();
      } catch (e) {
        console.error("notif load error", e);
      }
    }

    function openNotifications() {
      showNotifPanel.value = !showNotifPanel.value;
    }

    async function clickNotif(n) {
      try {
        if (!n.read_at) {
          await markNotifRead(n.id);
          await loadNotifs();
        }
      } catch (e) {
        console.error(e);
      }
    }
   
    const profile = reactive({
      username: "",
      full_name: "",
      campus: "",
      course_year: "",
      active_scholarship: null,
    });

    async function loadProfile() {
      try {
        const p = await getProfile();
        profile.username = p.username || "";
        profile.full_name = p.full_name || "";
        profile.campus = p.campus || "";
        profile.course_year = p.course_year || "";
        profile.active_scholarship = p.active_scholarship || null;
      } catch (e) {
        console.error("Profile load error:", e);
      }
    }

  
    const scholarships = ref([]);
    const myApplications = ref([]);

    async function loadEnlist() {
      try {
        const sList = await getScholarships();
        const myApps = await getMyApplications();

        const appliedMap = new Map(myApps.map(a => [a.scholarship_id, a.status]));

        scholarships.value = (sList || []).map(s => ({
          ...s,
          eligible: s.eligible !== false,
          applied: appliedMap.has(s.id),
          applied_status: appliedMap.get(s.id) || null,
        }));

        myApplications.value = myApps || [];
      } catch (e) {
        console.error("Enlist load error:", e);
      }
    }

    async function applyScholarshipAction(id) {
      try {
        await applyScholarship(id);
        await loadEnlist();
      } catch (e) {
        console.error(e);
        alert("Failed to apply.");
      }
    }

    function checkEligibility(id) {
      console.log("check eligibility for", id);
      alert("Eligibility check not implemented yet.");
    }

    async function removeApplication(appId) {
      try {
        await removeApplicationApi(appId);
        await loadEnlist();
      } catch (e) {
        console.error(e);
        alert("Failed to remove application.");
      }
    }

    function submitRequirements(appId) {
      console.log("submit requirements for", appId);
      alert("Submit requirements page not implemented yet.");
    }

    function statusClass(status) {
      const s = String(status || "").toLowerCase();
      return `status-${s}`;
    }

    function formatStatus(status) {
      const s = String(status || "").toLowerCase();
      return s.charAt(0).toUpperCase() + s.slice(1);
    }


    const gwaRows = ref([]);
    const gwaResult = ref("");
    const gwaMessage = ref("");
    const gwaMessageClass = ref("");

    function addRow() {
      gwaRows.value.push({ subject: "", units: null, grade: null });
    }

    function deleteRow(index) {
      gwaRows.value.splice(index, 1);
    }

    function clearAll() {
      gwaRows.value = [];
      gwaResult.value = "";
      gwaMessage.value = "";
      gwaMessageClass.value = "";
    }

    function calculateGWA() {
      let totalUnits = 0;
      let totalWeighted = 0;

      gwaRows.value.forEach((r) => {
        const units = Number(r.units) || 0;
        const grade = Number(r.grade) || 0;
        if (units > 0 && grade > 0) {
          totalUnits += units;
          totalWeighted += units * grade;
        }
      });

      const gwaNum = totalUnits > 0 ? totalWeighted / totalUnits : 0;
      const gwa = gwaNum.toFixed(2);

      gwaResult.value = `Your GWA is: ${gwa}`;

      if (gwaNum <= 1.5) {
        gwaMessage.value = "Congrats you are a merit university scholar!";
        gwaMessageClass.value = "text-green";
      } else if (gwaNum <= 1.75) {
        gwaMessage.value = "Congrats you are a merit college scholar!";
        gwaMessageClass.value = "text-green";
      } else {
        gwaMessage.value = "Still Congrats! Try again next sem to achieve merit scholarships.";
        gwaMessageClass.value = "text-red";
      }
    }

  
    const savedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const studentName = ref(
      savedUser.full_name ||
      savedUser.username ||
      localStorage.getItem("student_name") ||
      "Student"
    );

    const activeSection = ref(localStorage.getItem("activeSection") || "dashboard");
    const setSection = (sec) => {
      activeSection.value = sec;
      localStorage.setItem("activeSection", sec);
    };

    // -------------------- DASHBOARD CHARTS --------------------
    const totals = reactive({
      totalScholarships: 0,
      totalApplicants: 0,
      totalSlots: 0,
      totalApproved: 0,
    });

    const scholarshipLabels = ref([]);
    const scholarshipCounts = ref([]);

    const statusCounts = reactive({
      approved: 0,
      pending: 0,
      rejected: 0,
    });

    const scholarshipChartRef = ref(null);
    const statusChartRef = ref(null);

    let scholarshipChart = null;
    let statusChart = null;

    async function loadDashboard() {
      try {
        const t = await getTotals();
        totals.totalScholarships = t.scholarships ?? 0;
        totals.totalApplicants = t.applicants ?? 0;
        totals.totalSlots = t.slots ?? 0;
        totals.totalApproved = t.approved ?? 0;

        const perScholar = await getApplicantsPerScholarship();
        scholarshipLabels.value = perScholar.labels ?? [];
        scholarshipCounts.value = perScholar.counts ?? [];

        const dist = await getStatusDistribution();
        statusCounts.approved = dist.approved ?? 0;
        statusCounts.pending = dist.pending ?? 0;
        statusCounts.rejected = dist.rejected ?? 0;

        buildCharts();
      } catch (err) {
        console.error("Dashboard load error:", err);
      }
    }

    function buildCharts() {
      if (scholarshipChart) scholarshipChart.destroy();
      if (statusChart) statusChart.destroy();

      scholarshipChart = new Chart(scholarshipChartRef.value, {
        type: "bar",
        data: {
          labels: scholarshipLabels.value,
          datasets: [
            {
              label: "Number of Applicants",
              data: scholarshipCounts.value,
              backgroundColor: "rgba(75, 192, 192, 0.6)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: false } },
          scales: { y: { beginAtZero: true } },
        },
      });

      statusChart = new Chart(statusChartRef.value, {
        type: "pie",
        data: {
          labels: ["Approved", "Pending", "Rejected"],
          datasets: [
            {
              data: [
                statusCounts.approved,
                statusCounts.pending,
                statusCounts.rejected,
              ],
              backgroundColor: ["#90ee90", "#FFA500", "#FF0000"],
              borderColor: "#fff",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                color: "#333",
                font: { size: 14, weight: "bold" },
              },
            },
          },
        },
      });
    }

  async function doLogout() {
  try {
    await logout();
  } catch (e) {
    console.error("Logout failed:", e);
  } finally {
    localStorage.clear();
    router.push("/login");
  }
}

    onMounted(async () => {
      await loadDashboard();
      await loadEnlist();
      await loadProfile();
      await loadNotifs(); 
    });

    onBeforeUnmount(() => {
      if (scholarshipChart) scholarshipChart.destroy();
      if (statusChart) statusChart.destroy();
    });

    return {
      studentName,
      activeSection,
      setSection,
      doLogout,
      totals,
      scholarshipChartRef,
      statusChartRef,
      profile,

      scholarships,
      myApplications,
      applyScholarshipAction,
      checkEligibility,
      removeApplication,
      submitRequirements,
      statusClass,
      formatStatus,

      gwaRows,
      gwaResult,
      addRow,
      deleteRow,
      clearAll,
      calculateGWA,
      gwaMessage,
      gwaMessageClass,

     
      notifCount,
      notifications,
      showNotifPanel,
      openNotifications,
      clickNotif,
    };
  },
};
</script>

<style scoped>


.navbar-right {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

/* Bell */
.bell-btn {
  position: relative;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  padding: 4px;
  display: grid;
  place-items: center;
}

.bell-icon {
  width: 20px;
  height: 20px;
}

.notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: red;
  color: white;
  font-size: 10px;
  font-weight: 800;
  border-radius: 50%;
  padding: 2px 5px;
  line-height: 1;
}

.notif-panel {
  position: absolute;
  top: 44px;
  right: 0;
  width: 320px;
  background: #fff;
  color: #111;
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.18);
  padding: 8px;
  z-index: 999;
  max-height: 420px;
  overflow-y: auto;
}

.notif-item {
  padding: 10px;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  border-radius: 8px;
}
.notif-item:hover { background: #f7fbff; }

.notif-item.unread {
  background: #e8f5e9;
  font-weight: 700;
}

.notif-title {
  font-size: 14px;
  font-weight: 800;
}
.notif-body {
  font-size: 13px;
  margin-top: 4px;
  color: #444;
}
.notif-type {
  font-size: 11px;
  color: #888;
}

.notif-empty {
  padding: 12px;
  text-align: center;
  color: #777;
}







.dashboard-page {
  font-family: Arial, sans-serif;
  background: #f4f6f9;
  min-height: 100vh;
}

/* Sidebar */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 230px;
  height: 100%;
  background-color: #1f6788;
  color: white;
  padding-top: 10px;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  z-index: 5;
}

.sidebar h1 {
  font-size: 30px;
  font-weight: bold;
  color: #a8d8ff;
  text-align: center;
  margin-bottom: 5px;
}

.sidebar hr {
  border: none;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  margin: 10px 20px;
}

/* ✅ use nav-link class so active works */
.sidebar .nav-link {
  color: white;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 25px;
  border-radius: 8px;
  margin: 3px 10px;
  font-size: 15px;
  transition: all 0.2s ease-in-out;
  cursor: pointer;
}

.sidebar .nav-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
  transform: translateX(4px);
}

.sidebar .nav-link.active {
  background-color: #4caf50;
  font-weight: bold;
}

.sidebar .nav-link .icon {
  width: 20px;
  height: 20px;
  color: white;
  flex-shrink: 0;
}

/* Navbar - flush, no spacing */
.navbar {
  position: sticky;
  top: 0;
  margin-left: 222px;
  width: calc(100% - 255px);
  height: 60px;
  background-color: #4caf50;
  color: white;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-radius: 0;
  box-shadow: 0 2px 12px rgba(0,0,0,0.25);
  z-index: 10;
}

.navbar-title {
  margin: 0;
  font-size: 22px;
  font-weight: 800;
  letter-spacing: 1px;
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 8px; /* small space between name & bell */
  font-weight: 700;
}

/* Bell button */
.bell-btn {
  position: relative;
  border: none;
  background: transparent;
  color: white;
  cursor: pointer;
  padding: 4px;
  display: grid;
  place-items: center;
}

.bell-icon {
  width: 20px;
  height: 20px;
}

/* Badge */
.notif-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: red;
  color: white;
  font-size: 10px;
  font-weight: 800;
  border-radius: 50%;
  padding: 2px 5px;
  line-height: 1;
}


/* Title */
.navbar-title {
  margin: 0;
  font-size: 22px;
  font-weight: 900;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Right side welcome */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 600;
  white-space: nowrap;
}

.navbar-right .welcome {
  opacity: 0.9;
  font-weight: 600;
}

.navbar-right .student {
  font-weight: 900;
  text-transform: capitalize;
}

/* Main content */
.main {
  margin-left: 230px;
  margin-top: 10px;
  padding: 20px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.card {
  background: #fff;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.card h3 {
  margin: 10px 0;
}

/* Charts row */
.charts-row {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin: 30px auto;
  flex-wrap: wrap;
}

.chart-box {
  width: 45%;
  min-width: 300px;
  background: #fff;
  padding: 15px;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

.chart-box h2 {
  text-align: center;
  font-size: 18px;
  margin-bottom: 10px;
}
.text-green {
  color: green;
}

.text-red {
  color: red;
}

/* ---------- GWA CALCULATOR UI ---------- */
.gwa-section {
  max-width: 980px;
  margin: 0 auto;
}

.gwa-header {
  margin-bottom: 14px;
}
.gwa-header h2 {
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 4px;
}
.gwa-header p {
  font-size: 14px;
  color: #555;
}

.gwa-table-wrap {
  background: #fff;
  padding: 14px;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
  overflow-x: auto;
}

.gwa-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 700px;
}

.gwa-table thead th {
  background: #1f6788;
  color: #fff;
  font-weight: 700;
  font-size: 14px;
  padding: 12px;
  text-align: left;
}

.gwa-table tbody td {
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
}

.gwa-table tbody tr:hover {
  background: #f7fbff;
}

.gwa-input {
  width: 100%;
  padding: 9px 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  outline: none;
  background: #fafafa;
  font-size: 14px;
  transition: 0.15s ease;
}
.gwa-input:focus {
  border-color: #4caf50;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(76,175,80,0.15);
}

.action-col {
  width: 120px;
  text-align: center;
}

.gwa-empty {
  text-align: center;
  padding: 18px;
  color: #777;
  font-style: italic;
}

.gwa-actions {
  display: flex;
  gap: 10px;
  margin-top: 14px;
  flex-wrap: wrap;
}

.gwa-btn {
  padding: 10px 14px;
  border: none;
  border-radius: 9px;
  font-weight: 700;
  cursor: pointer;
  font-size: 14px;
  transition: 0.15s ease;
}

.gwa-btn.primary {
  background: #1f6788;
  color: #fff;
}
.gwa-btn.primary:hover { transform: translateY(-1px); opacity: 0.95; }

.gwa-btn.success {
  background: #4caf50;
  color: #fff;
}
.gwa-btn.success:hover { transform: translateY(-1px); opacity: 0.95; }

.gwa-btn.danger {
  background: #e74c3c;
  color: #fff;
}
.gwa-btn.danger:hover { transform: translateY(-1px); opacity: 0.95; }

.gwa-btn.ghost {
  background: transparent;
  border: 2px solid #e74c3c;
  color: #e74c3c;
}
.gwa-btn.ghost:hover {
  background: #e74c3c;
  color: #fff;
}

/* result box */
.gwa-result-box {
  margin-top: 16px;
  background: #fff;
  padding: 14px 16px;
  border-radius: 10px;
  border-left: 6px solid #4caf50;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.gwa-result-box h3 {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 800;
}

/* congrats/try again colors (kept from earlier) */
.text-green { color: green; font-weight: 800; }
.text-red { color: red; font-weight: 800; }


/* ---------------- ENLIST UI ---------------- */
.content-section table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}

.content-section th {
  background: #1f4d2a;
  color: #fff;
  font-weight: 800;
  padding: 10px;
  font-size: 14px;
  text-align: left;
}

.content-section td {
  padding: 10px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.content-section tr:hover td {
  background: #f7fbff;
}

/* buttons same vibe as PHP */
.btn-green {
  background: #0aa30a;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 18px;
  font-weight: 800;
  cursor: pointer;
}
.btn-green:hover { opacity: 0.9; }

.btn-red {
  background: #e53935;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 18px;
  font-weight: 800;
  cursor: pointer;
}
.btn-red:hover { opacity: 0.9; }

.btnsubmit {
  background: #d32f2f;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 18px;
  font-weight: 800;
  cursor: pointer;
}

.btn-trash {
  background: #ff5252;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
}

/* ===== PROFILE UI ===== */
.section-title {
  font-size: 26px;
  font-weight: 800;
  margin-bottom: 14px;
  color: #111;
}

.profile-card {
  background: #fff;
  border-radius: 14px;
  padding: 18px 20px;
  max-width: 520px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  border: 1px solid #eee;
}

.profile-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px dashed #eee;
}

.profile-row:last-child {
  border-bottom: none;
}

.profile-label {
  font-weight: 700;
  color: #2c3e50;
  font-size: 14px;
}

.profile-value {
  font-weight: 600;
  color: #111;
  font-size: 14px;
}

.profile-value.ok {
  color: #0d8f3a; /* green */
  font-weight: 800;
}

.profile-value.none {
  color: #888;
  font-style: italic;
}



</style>

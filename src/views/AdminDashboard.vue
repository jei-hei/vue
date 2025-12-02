<template>
  <div class="admin-root">
    <!-- NAVBAR -->
    <header class="admin-navbar">
      <nav class="links">
        <a
          href="#"
          class="nav-link"
          :class="{ active: activeTab === 'dashboard' }"
          @click.prevent="activeTab = 'dashboard'"> Analytics Dashboard
        </a>

        <a
          href="#"
          class="nav-link"
          :class="{ active: activeTab === 'applications' }"
          @click.prevent="activeTab = 'applications'"> Applications
        </a>

        <a href="#" class="nav-link" @click.prevent="activeTab='test3'">PAGE3</a>
        <a href="#" class="nav-link" @click.prevent="activeTab='test4'">PAGE4</a>
        <a href="#" class="nav-link" @click.prevent="activeTab='test5'">PAGE5</a>
      </nav>
    </header>

    <main class="admin-main">
    
      <section v-if="activeTab === 'dashboard'" class="content-section">
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


      <section v-else-if="activeTab === 'applications'" class="content-section">
        <h1>All Scholarship Applications</h1>

        <div class="table-wrap">
          <table class="apps-table">
            <thead>
              <tr>
                <th>STUDENT NAME</th>
                <th>STUDENT USERNAME</th>
                <th>SCHOLARSHIP</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="app in applications" :key="app.id">
                <td>{{ app.student_name }}</td>
                <td>{{ app.student_username }}</td>
                <td>{{ app.scholarship_name }}</td>

                <td>
                  <span :class="['status-pill', app.status.toLowerCase()]">
                    {{ app.status }}
                  </span>
                </td>

                <td class="actions-col">
                  <template v-if="app.status.toLowerCase() === 'pending'">
                    <button class="btn-approve" @click="approveApp(app)">
                      Approve
                    </button>
                    <button class="btn-reject" @click="rejectApp(app)">
                      Reject
                    </button>
                  </template>
                  <template v-else>
                    <em class="no-actions">No actions available</em>
                  </template>
                </td>
              </tr>

              <tr v-if="applications.length === 0">
                <td colspan="5" class="empty-row">No applications yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- OTHER PAGES -->
      <section v-else class="placeholder">
        <h1>Admin Dashboard</h1>
        <p>Empty content for now.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch } from "vue";
import Chart from "chart.js/auto";


import {
  getTotals,
  getApplicantsPerScholarship,
  getStatusDistribution,
  adminGetAllApplications,
  adminApproveApplication,
  adminRejectApplication,
} from "@/services/api";

const activeTab = ref("dashboard");

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
}

function buildCharts() {
  if (!scholarshipChartRef.value || !statusChartRef.value) return;

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
          borderRadius: 6,
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


const applications = ref([]);

async function loadApplications() {
  applications.value = await adminGetAllApplications();
}

async function approveApp(app) {
  await adminApproveApplication(app.id);
  await loadApplications();
  await loadDashboard();
}

async function rejectApp(app) {
  await adminRejectApplication(app.id);
  await loadApplications();
  await loadDashboard(); 
}


onMounted(async () => {
  await loadDashboard();
  await loadApplications();
});


watch(activeTab, (t) => {
  if (t === "dashboard") {
    setTimeout(buildCharts, 0);
  }
});
</script>

<style scoped>

.admin-root {
  min-height: 100vh;
  background: #f4f6f9;
}

/* NAVBAR */
.admin-navbar {
  width: 100%;
  background: #4caf50;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 20px;
  box-sizing: border-box;
  border-radius: 0 0 6px 6px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.12);
}

.links {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  justify-content: center;
  width: 100%;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  font-weight: 700;
  padding: 8px 12px;
  border-radius: 6px;
  transition: background 0.2s ease, transform 0.1s ease;
}
.nav-link:hover {
  background: rgba(255,255,255,0.18);
  transform: translateY(-1px);
}
.nav-link.active {
  background: rgba(255,255,255,0.28);
}

.admin-main { padding: 20px; }

/* cards */
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
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  text-align: center;
}
.card h3 { margin: 10px 0; }

/* charts */
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

/* table */
.table-wrap {
  background: #fff;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  margin-top: 10px;
}

.apps-table {
  width: 100%;
  border-collapse: collapse;
}

.apps-table thead th {
  background: #34495e;
  color: #fff;
  font-weight: 800;
  padding: 12px;
  font-size: 13px;
  text-align: left;
  letter-spacing: 0.4px;
}

.apps-table tbody td {
  padding: 12px;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}

.apps-table tbody tr:hover td {
  background: #f7fbff;
}

.actions-col {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-approve {
  background: #1db954;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 800;
  cursor: pointer;
  font-size: 12px;
}
.btn-reject {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 800;
  cursor: pointer;
  font-size: 12px;
}

.status-pill {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 800;
  font-size: 12px;
}
.status-pill.pending { background: #fff3cd; color: #a97900; }
.status-pill.approved { background: #d4edda; color: #0d8f3a; }
.status-pill.rejected { background: #f8d7da; color: #b00020; }

.empty-row {
  text-align: center;
  padding: 16px !important;
  font-style: italic;
  color: #777;
}

/* responsive */
@media (max-width: 1100px) {
  .cards { grid-template-columns: repeat(2, 1fr); }
  .chart-box { width: 100%; }
}
@media (max-width: 700px) {
  .cards { grid-template-columns: 1fr; }
  .actions-col { flex-direction: column; align-items: flex-start; }
}
</style>

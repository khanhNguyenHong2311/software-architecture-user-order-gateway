const GATEWAY_URL = "http://localhost:8000";
const USER_SERVICE_URL = "http://localhost:3001";
const ORDER_SERVICE_URL = "http://localhost:3002";

async function measureLatency(fn, iterations = 30) {
  const times = [];
  for (let i = 0; i < iterations; i++) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    times.push(end - start);
  }
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const min = Math.min(...times);
  const max = Math.max(...times);
  return {
    avg: Number(avg.toFixed(2)),
    min: Number(min.toFixed(2)),
    max: Number(max.toFixed(2)),
  };
}

async function run() {
  console.log("==================================================");
  console.log("   MICROSERVICES LATENCY BENCHMARK");
  console.log("==================================================");

  try {
    await fetch(`${GATEWAY_URL}/users/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "", password: "" }),
    });
  } catch {
    console.error("\n[LỖI] Không thể kết nối tới các dịch vụ.");
    console.error("Vui lòng khởi động các dịch vụ trước khi chạy benchmark:");
    console.error("  Terminal 1: cd services/user-service && npm run start:dev");
    console.error("  Terminal 2: cd services/order-service && npm run start:dev");
    console.error("  Terminal 3: cd gateway && npm run start:dev\n");
    process.exit(1);
  }

  const email = `benchmark_${Date.now()}@example.com`;
  const password = "password123";

  console.log("\n1. Khoi tao du lieu thu nghiem...");
  await fetch(`${GATEWAY_URL}/users/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      fullName: "Benchmark User",
      password,
    }),
  });

  const loginRes = await fetch(`${GATEWAY_URL}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const loginData = await loginRes.json();
  const token = loginData.accessToken;
  const userId = loginData.user.id;

  for (let i = 1; i <= 3; i++) {
    await fetch(`${GATEWAY_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ totalAmount: i * 100 }),
    });
  }
  console.log("-> Da tao user va 3 don hang thu nghiem thanh cong.");

  const ITERATIONS = 30;
  console.log(`\n2. Tien hanh do do tre (${ITERATIONS} requests moi kieu)...`);

  const directStats = await measureLatency(async () => {
    await fetch(`${ORDER_SERVICE_URL}/orders/my-orders`, {
      headers: { "x-user-id": userId },
    });
  }, ITERATIONS);

  const gatewayStats = await measureLatency(async () => {
    await fetch(`${GATEWAY_URL}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }, ITERATIONS);

  const dashboardStats = await measureLatency(async () => {
    await fetch(`${GATEWAY_URL}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }, ITERATIONS);

  const overhead = Number((gatewayStats.avg - directStats.avg).toFixed(2));

  console.log("\n==================================================");
  console.log("   KET QUA DO DO TRE (LATENCY BENCHMARK RESULT)");
  console.log("==================================================");
  console.table([
    {
      "Cach goi": "Goi truc tiep (Direct Order Service)",
      "Trung binh (ms)": directStats.avg,
      "Nhanh nhat (ms)": directStats.min,
      "Cham nhat (ms)": directStats.max,
    },
    {
      "Cach goi": "Goi qua API Gateway",
      "Trung binh (ms)": gatewayStats.avg,
      "Nhanh nhat (ms)": gatewayStats.min,
      "Cham nhat (ms)": gatewayStats.max,
    },
    {
      "Cach goi": "Gateway Aggregation (/dashboard)",
      "Trung binh (ms)": dashboardStats.avg,
      "Nhanh nhat (ms)": dashboardStats.min,
      "Cham nhat (ms)": dashboardStats.max,
    },
  ]);

  console.log(`\n-> Do tre phat sinh boi API Gateway (Overhead): ~${overhead} ms`);
  console.log("==================================================\n");
}

run();

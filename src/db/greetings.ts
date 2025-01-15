import fs from 'fs/promises';
import path from 'path';

interface Greeting {
    guildId: string;
    userId: string;
    message: string;
}

const DB_PATH = path.resolve('greetings.json');

// Kiểm tra xem file đã tồn tại chưa, nếu chưa thì tạo file mới
async function checkAndCreateDB(): Promise<void> {
    try {
        await fs.access(DB_PATH); // Kiểm tra quyền truy cập file
    } catch (error) {
        // Nếu không có file, tạo file mới
        await fs.writeFile(DB_PATH, JSON.stringify([], null, 2), 'utf8');
    }
}

// Đọc dữ liệu từ file JSON
async function readGreetings(): Promise<Greeting[]> {
    await checkAndCreateDB(); // Đảm bảo file đã tồn tại
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
}

// Ghi dữ liệu vào file JSON
async function writeGreetings(data: Greeting[]): Promise<void> {
    await checkAndCreateDB(); // Đảm bảo file đã tồn tại
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Đặt câu chào
export async function setGreeting(guildId: string, userId: string, message: string): Promise<void> {
    const greetings = await readGreetings();
    const index = greetings.findIndex((greet) => greet.guildId === guildId && greet.userId === userId);

    if (index !== -1) {
        greetings[index].message = message; // Cập nhật nếu đã tồn tại
    } else {
        greetings.push({ guildId, userId, message }); // Thêm mới
    }

    await writeGreetings(greetings);
}

// Lấy câu chào
export async function getGreeting(guildId: string, userId: string): Promise<string> {
    const greetings = await readGreetings();
    const greeting = greetings.find((greet) => greet.guildId === guildId && greet.userId === userId);
    return greeting?.message || 'Chào mừng bạn!';
}

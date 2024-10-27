import * as React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "./App";

global.fetch = jest.fn();

function renderWithInitialEntries(initialEntries) {
    return render(
        <MemoryRouter initialEntries={initialEntries}>
            <App />
        </MemoryRouter>
    );
}

describe("Home", () => {
    it("renders index route correctly", async () => {
        global.fetch.mockResolvedValue({
            json: () => Promise.resolve(mockedStudentData),
        });

        renderWithInitialEntries(["/"]);

        const button = screen.getByTestId("student-btn");
        expect(button).toBeInTheDocument();

        fireEvent.click(button);
        await waitFor(async () => {
            expect(
                await screen.findByText("Djarot Purnomo")
            ).toBeInTheDocument();
        });
    });
});

describe("Navbar", () => {
    it("renders navigation bar correctly", async () => {
        global.fetch.mockResolvedValue({
            json: () => Promise.resolve(mockedStudentData),
        });

        renderWithInitialEntries(["/student"]);

        screen.getByText("Loading ...");
        await screen.findByText("Djarot Purnomo");

        expect(screen.getByTestId("home-page")).toBeInTheDocument();
        expect(screen.getByTestId("student-page")).toBeInTheDocument();
        expect(screen.getByTestId("add-page")).toBeInTheDocument();
    });

    it("should call correct home path", async () => {
        global.fetch.mockResolvedValue({
            json: () => Promise.resolve(mockedStudentData),
        });

        renderWithInitialEntries(["/student"]);

        screen.getByText("Loading ...");
        await screen.findByText("Djarot Purnomo");

        fireEvent.click(screen.getByTestId("home-page"));

        expect(screen.getByTestId("student-btn")).toBeInTheDocument();
    });

    it("should call correct student path", async () => {
        global.fetch.mockResolvedValue({
            json: () => Promise.resolve(mockedStudentData),
        });

        renderWithInitialEntries(["/add"]);

        fireEvent.click(screen.getByTestId("student-page"));

        screen.getByText("Loading ...");
        await waitFor(async () =>
            expect(await screen.findByText("Djarot Purnomo")).toBeTruthy()
        );
    });

    it("should call correct add student path", async () => {
        global.fetch.mockResolvedValue({
            json: () => Promise.resolve(mockedStudentData),
        });

        renderWithInitialEntries(["/student"]);

        screen.getByText("Loading ...");
        await screen.findByText("Djarot Purnomo");

        fireEvent.click(screen.getByTestId("add-page"));

        expect(screen.getByTestId("name")).toBeInTheDocument();
        expect(screen.getByTestId("address")).toBeInTheDocument();
        expect(screen.getByTestId("profilePicture")).toBeInTheDocument();
        expect(screen.getByTestId("phoneNumber")).toBeInTheDocument();
        expect(screen.getByTestId("gender")).toBeInTheDocument();
        expect(screen.getByTestId("date")).toBeInTheDocument();
        expect(screen.getByTestId("prody")).toBeInTheDocument();
    });
});

describe("Student", () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it("should show Loading component", async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockedStudentData),
        });
        renderWithInitialEntries(["/student"]);
        await waitFor(async () =>
            expect(await screen.findByText("Loading ...")).toBeTruthy()
        );
    });

    it("should call correct path", async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockedStudentData),
        });
        renderWithInitialEntries(["/student"]);

        screen.getByText("Loading ...");
        await screen.findByText("Djarot Purnomo");

        await waitFor(() => {
            expect(fetch).toHaveBeenCalledWith("http://localhost:3001/student");
        });
    });

    it("should render all fetched items correctly", async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockedStudentData),
        });
        renderWithInitialEntries(["/student"]);

        screen.getByText("Loading ...");
        await screen.findByText("Djarot Purnomo");

        expect(screen.getByText("Siti Indah")).toBeInTheDocument();
        expect(screen.getByText("Rika Setyawati")).toBeInTheDocument();
        expect(screen.getByText("Nina Wahyuni")).toBeInTheDocument();
    });

    it("when delete should call fetch with correct url", async () => {
        global.fetch.mockResolvedValue({
            json: () => Promise.resolve(mockedStudentData),
        });

        renderWithInitialEntries(["/student"]);

        await screen.findByText("Djarot Purnomo");

        const deleteButton = screen.getByTestId("delete-1");
        fireEvent.click(deleteButton);
        const lastCall = fetch.mock.lastCall;

        expect(lastCall[0]).toBe("http://localhost:3001/student/1");
        expect(lastCall[1].method).toBe("DELETE");

        const deleteStudent = mockedStudentData.filter(
            (student) => student.id !== 1
        );

        global.fetch = jest.fn((url) => {
            switch (url) {
                case "http://localhost:3001/student":
                    return Promise.resolve({
                        json: () => Promise.resolve(deleteStudent),
                    });
                case "http://localhost:3001/student/1":
                    return Promise.resolve({
                        json: () => Promise.resolve(deleteStudent),
                    });
                default:
                    return Promise.reject(new Error("URL Not Found"));
            }
        });

        await waitFor(() =>
            expect(screen.queryByText("Djarot Purnomo")).toBeNull()
        );
    });

    it("should show all student correctly when filtered by all", async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockedStudentData),
        });
        const { container } = renderWithInitialEntries(["/student"]);

        screen.getByText("Loading ...");
        await screen.findByText("Djarot Purnomo");

        const filter = await screen.findByTestId("filter");

        fireEvent.change(filter, { target: { value: "All" } });

        const rows = Array.from(
            container.querySelectorAll(".student-data-row")
        );
        const data = extractData(rows);

        expect(data).toEqual(
            mockedStudentData.map((student) => {
                return student.fullname;
            })
        );
    });

    it("should filter correctly when filtered by Fakultas Ekonomi", async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockedStudentData),
        });
        const { container } = renderWithInitialEntries(["/student"]);
        screen.getByText("Loading ...");
        await screen.findByText("Djarot Purnomo");

        const filter = await screen.findByTestId("filter");

        fireEvent.change(filter, { target: { value: "Fakultas Ekonomi" } });

        const rows = Array.from(
            container.querySelectorAll(".student-data-row")
        );
        const data = extractData(rows);

        expect(data).toEqual(
            mockedStudentData
                .filter((student) => {
                    return student.faculty === "Fakultas Ekonomi";
                })
                .map((student) => {
                    return student.fullname;
                })
        );
    });

    it("should filter correctly when filtered by Fakultas Ilmu Sosial dan Politik", async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockedStudentData),
        });
        const { container } = renderWithInitialEntries(["/student"]);
        screen.getByText("Loading ...");
        await screen.findByText("Djarot Purnomo");

        const filter = await screen.findByTestId("filter");

        fireEvent.change(filter, {
            target: { value: "Fakultas Ilmu Sosial dan Politik" },
        });

        const rows = Array.from(
            container.querySelectorAll(".student-data-row")
        );
        const data = extractData(rows);

        expect(data).toEqual(
            mockedStudentData
                .filter((student) => {
                    return (
                        student.faculty === "Fakultas Ilmu Sosial dan Politik"
                    );
                })
                .map((student) => {
                    return student.fullname;
                })
        );
    });

    it("should filter correctly when filtered by Fakultas Teknik", async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockedStudentData),
        });
        const { container } = renderWithInitialEntries(["/student"]);
        screen.getByText("Loading ...");
        await screen.findByText("Djarot Purnomo");

        const filter = await screen.findByTestId("filter");

        fireEvent.change(filter, {
            target: { value: "Fakultas Teknik" },
        });

        const rows = Array.from(
            container.querySelectorAll(".student-data-row")
        );
        const data = extractData(rows);

        expect(data).toEqual(
            mockedStudentData
                .filter((student) => {
                    return student.faculty === "Fakultas Teknik";
                })
                .map((student) => {
                    return student.fullname;
                })
        );
    });

    it("should filter correctly when filtered by Fakultas Teknologi Informasi dan Sains", async () => {
        global.fetch.mockResolvedValueOnce({
            json: () => Promise.resolve(mockedStudentData),
        });
        const { container } = renderWithInitialEntries(["/student"]);
        screen.getByText("Loading ...");
        await screen.findByText("Djarot Purnomo");

        const filter = await screen.findByTestId("filter");

        fireEvent.change(filter, {
            target: { value: "Fakultas Teknologi Informasi dan Sains" },
        });

        const rows = Array.from(
            container.querySelectorAll(".student-data-row")
        );
        const data = extractData(rows);

        expect(data).toEqual(
            mockedStudentData
                .filter((student) => {
                    return (
                        student.faculty ===
                        "Fakultas Teknologi Informasi dan Sains"
                    );
                })
                .map((student) => {
                    return student.fullname;
                })
        );
    });
});

describe("Add", () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it("when submit should call fetch with correct url", async () => {
        global.fetch.mockResolvedValue({
            json: () => Promise.resolve(mockedStudentData),
        });

        renderWithInitialEntries(["/add"]);

        const name = screen.getByTestId("name");
        fireEvent.change(name, { target: { value: "Henky" } });
        const profilePicture = screen.getByTestId("profilePicture");
        fireEvent.change(profilePicture, {
            target: { value: "https://randomuser.me/api/portraits/men/45.jpg" },
        });
        const address = screen.getByTestId("address");
        fireEvent.change(address, {
            target: { value: "Surabaya, Indonesia" },
        });
        const phoneNumber = screen.getByTestId("phoneNumber");
        fireEvent.change(phoneNumber, {
            target: { value: "+6280987654321" },
        });
        const date = screen.getByTestId("date");
        fireEvent.change(date, { target: { value: "1995-11-14" } });
        const gender = screen.getByTestId("gender");
        fireEvent.change(gender, { target: { value: "Male" } });
        const prody = screen.getByTestId("prody");
        fireEvent.change(prody, { target: { value: "Ekonomi" } });
        const submitButton = screen.getByTestId("add-btn");
        fireEvent.click(submitButton);
        const lastCall = fetch.mock.lastCall;
        const body = JSON.parse(lastCall[1].body);

        expect(lastCall[0]).toBe("http://localhost:3001/student");
        expect(lastCall[1].method).toBe("POST");
        expect(lastCall[1].headers["Content-Type"]).toBe("application/json");
        expect(body.fullname).toBe("Henky");
        expect(body.profilePicture).toBe(
            "https://randomuser.me/api/portraits/men/45.jpg"
        );
        expect(body.address).toBe("Surabaya, Indonesia");
        expect(body.phoneNumber).toBe("+6280987654321");
        expect(body.birthDate).toBe("1995-11-14");
        expect(body.gender).toBe("Male");
        expect(body.faculty).toBe("Fakultas Ekonomi");
        expect(body.programStudy).toBe("Ekonomi");

        global.fetch.mockResolvedValue({
            json: () =>
                Promise.resolve([
                    ...mockedStudentData,
                    {
                        id: 11,
                        fullname: "Henky",
                        profilePicture:
                            "https://randomuser.me/api/portraits/men/45.jpg",
                        address: "Surabaya, Indonesia",
                        phoneNumber: "+6280987654321",
                        birthDate: "1995-11-14",
                        gender: "Male",
                        faculty: "Fakultas Ekonomi",
                        programStudy: "Ekonomi",
                    },
                ]),
        });
        await waitFor(() => screen.findByText("Henky"));
    });
});

describe("Edit", () => {
    beforeEach(() => {
        fetch.mockClear();
    });

    it("should show Loading component", async () => {
        const student = mockedStudentData.filter((student) => student.id === 1);
        global.fetch.mockResolvedValue({
            json: () => Promise.resolve(student),
        });
        renderWithInitialEntries(["/student/1"]);
        await waitFor(async () =>
            expect(await screen.findByText("Loading ...")).toBeTruthy()
        );
    });

    it("should call fetch with correct url", async () => {
        const student = mockedStudentData.filter((student) => student.id === 1);
        global.fetch.mockResolvedValue({
            json: () => Promise.resolve(student),
        });

        renderWithInitialEntries(["/student/1"]);

        screen.getByText("Loading ...");
        await screen.findByRole("img");

        const lastCall = fetch.mock.lastCall;

        expect(lastCall[0]).toBe("http://localhost:3001/student/1");
    });

    it("when submit should call fetch with correct url", async () => {
        const student = mockedStudentData.filter((student) => student.id === 1);
        global.fetch.mockResolvedValue({
            json: () => Promise.resolve(student),
        });

        renderWithInitialEntries(["/student/1"]);

        screen.getByText("Loading ...");
        await screen.findByRole("img");

        const name = screen.getByTestId("name");
        fireEvent.change(name, { target: { value: "Henky" } });
        const address = screen.getByTestId("address");
        fireEvent.change(address, {
            target: { value: "Surabaya, Indonesia" },
        });
        const phoneNumber = screen.getByTestId("phoneNumber");
        fireEvent.change(phoneNumber, {
            target: { value: "+6280987654321" },
        });
        const date = screen.getByTestId("date");
        fireEvent.change(date, { target: { value: "1995-11-14" } });
        const gender = screen.getByTestId("gender");
        fireEvent.change(gender, { target: { value: "Male" } });
        const prody = screen.getByTestId("prody");
        fireEvent.change(prody, { target: { value: "Ekonomi" } });
        const submitButton = screen.getByTestId("edit-btn");
        fireEvent.click(submitButton);
        const lastCall = fetch.mock.lastCall;
        const body = JSON.parse(lastCall[1].body);

        expect(lastCall[0]).toBe("http://localhost:3001/student/1");
        expect(lastCall[1].method).toBe("PUT");
        expect(lastCall[1].headers["Content-Type"]).toBe("application/json");
        expect(body.fullname).toBe("Henky");
        expect(body.address).toBe("Surabaya, Indonesia");
        expect(body.phoneNumber).toBe("+6280987654321");
        expect(body.birthDate).toBe("1995-11-14");
        expect(body.gender).toBe("Male");
        expect(body.faculty).toBe("Fakultas Ekonomi");
        expect(body.programStudy).toBe("Ekonomi");

        global.fetch.mockResolvedValue({
            json: () =>
                Promise.resolve([
                    ...mockedStudentData,
                    (mockedStudentData[0] = {
                        id: 1,
                        fullname: "Henky",
                        profilePicture:
                            "https://randomuser.me/api/portraits/men/2.jpg",
                        address: "Surabaya, Indonesia",
                        phoneNumber: "+6280987654321",
                        birthDate: "1995-11-14",
                        gender: "Male",
                        faculty: "Fakultas Ekonomi",
                        programStudy: "Ekonomi",
                    }),
                ]),
        });
        await waitFor(() => screen.findByText("Henky"));
    });
});

describe("Not Found", () => {
    it("should show a 404 page", async () => {
        renderWithInitialEntries(["/bad-routes"]);
        await waitFor(() => screen.findByText(/Not Found/));
    });
});

const extractData = (rows) => {
    return rows
        .map((el) => {
            return Array.from(el.children)
                .filter((child) => {
                    return (
                        mockedStudentData.filter((student) => {
                            return student.fullname === child.textContent;
                        }).length > 0
                    );
                })
                .map((child) => child.textContent);
        })
        .flat();
};

const mockedStudentData = [
    {
        id: 1,
        fullname: "Djarot Purnomo",
        profilePicture: "https://randomuser.me/api/portraits/men/2.jpg",
        address: "Bogor, Indonesia",
        birthDate: "1995-03-15",
        gender: "Male",
        phoneNumber: "+6280987654321",
        faculty: "Fakultas Ilmu Sosial dan Politik",
        programStudy: "Administrasi Bisnis",
    },
    {
        id: 2,
        fullname: "Anshori Atmodiredjo",
        profilePicture: "https://randomuser.me/api/portraits/men/47.jpg",
        address: "Bandung, Indonesia",
        birthDate: "1993-08-21",
        gender: "Male",
        phoneNumber: "+6289876543210",
        faculty: "Fakultas Teknologi Informasi dan Sains",
        programStudy: "Matematika",
    },
    {
        id: 3,
        fullname: "Michael Johnson",
        profilePicture: "https://randomuser.me/api/portraits/men/3.jpg",
        address: "Surabaya, Indonesia",
        birthDate: "1998-05-07",
        gender: "Male",
        phoneNumber: "+6285555555555",
        faculty: "Fakultas Ekonomi",
        programStudy: "Ekonomi",
    },
    {
        id: 4,
        fullname: "Sarah Tan",
        profilePicture: "https://randomuser.me/api/portraits/women/4.jpg",
        address: "Yogyakarta, Indonesia",
        birthDate: "1994-11-12",
        gender: "Female",
        phoneNumber: "+6289999999999",
        faculty: "Fakultas Ilmu Sosial dan Politik",
        programStudy: "Administrasi Publik",
    },
    {
        id: 5,
        fullname: "Ahmad Abdullah",
        profilePicture: "https://randomuser.me/api/portraits/men/5.jpg",
        address: "Medan, Indonesia",
        birthDate: "1997-06-28",
        gender: "Male",
        phoneNumber: "+6287777777777",
        faculty: "Fakultas Teknik",
        programStudy: "Teknik Sipil",
    },
    {
        id: 6,
        fullname: "Lisa Wong",
        profilePicture: "https://randomuser.me/api/portraits/women/6.jpg",
        address: "Surabaya, Indonesia",
        birthDate: "1996-09-02",
        gender: "Female",
        phoneNumber: "+6281111111111",
        faculty: "Fakultas Teknologi Informasi dan Sains",
        programStudy: "Informatika",
    },
    {
        id: 7,
        fullname: "David Lee",
        profilePicture: "https://randomuser.me/api/portraits/men/7.jpg",
        address: "Jakarta, Indonesia",
        birthDate: "1995-07-17",
        gender: "Male",
        phoneNumber: "+6282222222222",
        faculty: "Fakultas Teknologi Informasi dan Sains",
        programStudy: "Fisika",
    },
    {
        id: 8,
        fullname: "Siti Indah",
        profilePicture: "https://randomuser.me/api/portraits/women/8.jpg",
        address: "Bandung, Indonesia",
        birthDate: "1992-12-25",
        gender: "Female",
        phoneNumber: "+6283333333333",
        faculty: "Fakultas Teknologi Informasi dan Sains",
        programStudy: "Informatika",
    },
    {
        id: 9,
        fullname: "Budi Santoso",
        profilePicture: "https://randomuser.me/api/portraits/men/9.jpg",
        address: "Yogyakarta, Indonesia",
        birthDate: "1994-04-09",
        gender: "Male",
        phoneNumber: "+6284444444444",
        faculty: "Fakultas Ekonomi",
        programStudy: "Manajemen",
    },
    {
        id: 10,
        fullname: "Rina Amalia",
        profilePicture: "https://randomuser.me/api/portraits/women/10.jpg",
        address: "Medan, Indonesia",
        birthDate: "1997-11-30",
        gender: "Female",
        phoneNumber: "+6286666666666",
        faculty: "Fakultas Ilmu Sosial dan Politik",
        programStudy: "Hubungan Internasional",
    },
    {
        id: 11,
        fullname: "Andre Wijaya",
        profilePicture: "https://randomuser.me/api/portraits/men/11.jpg",
        address: "Surabaya, Indonesia",
        birthDate: "1998-02-18",
        gender: "Male",
        phoneNumber: "+6287777777777",
        faculty: "Fakultas Teknik",
        programStudy: "Arsitektur",
    },
    {
        id: 12,
        fullname: "Dewi Susanti",
        profilePicture: "https://randomuser.me/api/portraits/women/12.jpg",
        address: "Jakarta, Indonesia",
        birthDate: "1995-06-13",
        gender: "Female",
        phoneNumber: "+6288888888888",
        faculty: "Fakultas Teknologi Informasi dan Sains",
        programStudy: "Informatika",
    },
    {
        id: 13,
        fullname: "Rudi Setiawan",
        profilePicture: "https://randomuser.me/api/portraits/men/13.jpg",
        address: "Bandung, Indonesia",
        birthDate: "1993-03-09",
        gender: "Male",
        phoneNumber: "+6289999999999",
        faculty: "Fakultas Teknologi Informasi dan Sains",
        programStudy: "Fisika",
    },
    {
        id: 14,
        fullname: "Lina Hartati",
        profilePicture: "https://randomuser.me/api/portraits/women/14.jpg",
        address: "Yogyakarta, Indonesia",
        birthDate: "1994-08-05",
        gender: "Female",
        phoneNumber: "+6281010101010",
        faculty: "Fakultas Ekonomi",
        programStudy: "Akuntansi",
    },
    {
        id: 15,
        fullname: "Hendro Wijaya",
        profilePicture: "https://randomuser.me/api/portraits/men/15.jpg",
        address: "Medan, Indonesia",
        birthDate: "1997-01-22",
        gender: "Male",
        phoneNumber: "+6281212121212",
        faculty: "Fakultas Ilmu Sosial dan Politik",
        programStudy: "Administrasi Bisnis",
    },
    {
        id: 16,
        fullname: "Yulia Cahyani",
        profilePicture: "https://randomuser.me/api/portraits/women/16.jpg",
        address: "Surabaya, Indonesia",
        birthDate: "1996-04-17",
        gender: "Female",
        phoneNumber: "+6281313131313",
        faculty: "Fakultas Teknik",
        programStudy: "Teknik Sipil",
    },
    {
        id: 17,
        fullname: "Tono Saputra",
        profilePicture: "https://randomuser.me/api/portraits/men/17.jpg",
        address: "Jakarta, Indonesia",
        birthDate: "1995-10-11",
        gender: "Male",
        phoneNumber: "+6281414141414",
        faculty: "Fakultas Teknologi Informasi dan Sains",
        programStudy: "Informatika",
    },
    {
        id: 18,
        fullname: "Nina Wahyuni",
        profilePicture: "https://randomuser.me/api/portraits/women/18.jpg",
        address: "Bandung, Indonesia",
        birthDate: "1993-05-27",
        gender: "Female",
        phoneNumber: "+6281515151515",
        faculty: "Fakultas Teknologi Informasi dan Sains",
        programStudy: "Matematika",
    },
    {
        id: 19,
        fullname: "Arief Kurniawan",
        profilePicture: "https://randomuser.me/api/portraits/men/19.jpg",
        address: "Yogyakarta, Indonesia",
        birthDate: "1994-12-03",
        gender: "Male",
        phoneNumber: "+6281616161616",
        faculty: "Fakultas Ekonomi",
        programStudy: "Manajemen",
    },
    {
        id: 20,
        fullname: "Rika Setyawati",
        profilePicture: "https://randomuser.me/api/portraits/women/20.jpg",
        address: "Medan, Indonesia",
        birthDate: "1997-07-20",
        gender: "Female",
        phoneNumber: "+6281717171717",
        faculty: "Fakultas Ilmu Sosial dan Politik",
        programStudy: "Administrasi Publik",
    },
    {
        id: 21,
        fullname: "Eko Prasetyo",
        profilePicture: "https://randomuser.me/api/portraits/men/21.jpg",
        address: "Surabaya, Indonesia",
        birthDate: "1998-10-16",
        gender: "Male",
        phoneNumber: "+6281818181818",
        faculty: "Fakultas Teknik",
        programStudy: "Teknik Sipil",
    },
    {
        id: 22,
        fullname: "Rina Susanti",
        profilePicture: "https://randomuser.me/api/portraits/women/22.jpg",
        address: "Jakarta, Indonesia",
        birthDate: "1995-02-11",
        gender: "Female",
        phoneNumber: "+6281919191919",
        faculty: "Fakultas Teknologi Informasi dan Sains",
        programStudy: "Informatika",
    },
    {
        id: 23,
        fullname: "Budi Setiawan",
        profilePicture: "https://randomuser.me/api/portraits/men/23.jpg",
        address: "Bandung, Indonesia",
        birthDate: "1993-09-06",
        gender: "Male",
        phoneNumber: "+6282020202020",
        faculty: "Fakultas Teknologi Informasi dan Sains",
        programStudy: "Fisika",
    },
    {
        id: 24,
        fullname: "Sari Rahmawati",
        profilePicture: "https://randomuser.me/api/portraits/women/24.jpg",
        address: "Yogyakarta, Indonesia",
        birthDate: "1994-04-02",
        gender: "Female",
        phoneNumber: "+6282121212121",
        faculty: "Fakultas Ekonomi",
        programStudy: "Akuntansi",
    },
    {
        id: 25,
        fullname: "Eko Setiawan",
        profilePicture: "https://randomuser.me/api/portraits/men/25.jpg",
        address: "Medan, Indonesia",
        birthDate: "1997-11-27",
        gender: "Male",
        phoneNumber: "+6282222222222",
        faculty: "Fakultas Ilmu Sosial dan Politik",
        programStudy: "Administrasi Bisnis",
    },
    {
        id: 26,
        fullname: "Rini Hartati",
        profilePicture: "https://randomuser.me/api/portraits/women/26.jpg",
        address: "Surabaya, Indonesia",
        birthDate: "1996-02-21",
        gender: "Female",
        phoneNumber: "+6282323232323",
        faculty: "Fakultas Teknik",
        programStudy: "Arsitektur",
    },
    {
        id: 27,
        fullname: "Andi Wijaya",
        profilePicture: "https://randomuser.me/api/portraits/men/27.jpg",
        address: "Jakarta, Indonesia",
        birthDate: "1995-08-17",
        gender: "Male",
        phoneNumber: "+6282424242424",
        faculty: "Fakultas Teknologi Informasi dan Sains",
        programStudy: "Informatika",
    },
    {
        id: 28,
        fullname: "Tina Cahaya",
        profilePicture: "https://randomuser.me/api/portraits/women/28.jpg",
        address: "Bandung, Indonesia",
        birthDate: "1993-03-14",
        gender: "Female",
        phoneNumber: "+6282525252525",
        faculty: "Fakultas Teknologi Informasi dan Sains",
        programStudy: "Matematika",
    },
];

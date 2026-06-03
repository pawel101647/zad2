const http = require("http");

const PORT = 3000;
const AUTHOR = "Paweł Piwowarski";

const cities = [
    "Lublin, PL",
    "Kraków, PL",
    "Stockholm, SE",
    "Kiruna, SE"
];

const server = http.createServer(async (req, res) => {
    // STRONA GŁÓWNA
    if (req.url === "/") {
        let options = "";
        cities.forEach(city => {
            options += `<option value="${city}">${city}</option>`;
        });

        res.writeHead(200, {
            "Content-Type": "text/html; charset=utf-8"
        });

        res.end(`
<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>Pogoda</title>
</head>

<body>

<h1>Wybierz miasto</h1>

<form action="/weather">

<select name="city">
    ${options}
</select>

<br><br>

<button type="submit">
    Sprawdź pogodę
</button>

</form>

</body>
</html>
`);
    }
    // POGODA
    else if (req.url.startsWith("/weather")) {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const city = url.searchParams.get("city");

        if (!city) {
            res.end("Nie wybrano miasta");
            return;
        }

        try {
            const response = await fetch(
                `https://wttr.in/${city}?format=j1`
            );

            const data = await response.json();
            const temperature = data.current_condition[0].temp_C;
            const condition = data.current_condition[0].weatherDesc[0].value;
            const wind = data.current_condition[0].windspeedKmph;

            res.writeHead(200, {
                "Content-Type": "text/html; charset=utf-8"
            });

            res.end(`
<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<title>Pogoda</title>
</head>

<body>

<h1>Pogoda</h1>

<p><b>Miasto:</b> ${city}</p>

<p><b>Temperatura:</b> ${temperature}°C</p>

<p><b>Warunki:</b> ${condition}</p>

<p><b>Wiatr:</b> ${wind} km/h</p>

<br>

<a href="/">Powrót</a>

</body>
</html>
`);
        } catch (err) {
            res.writeHead(500, {
                "Content-Type": "text/html; charset=utf-8"
            });

            res.end("Błąd pobierania pogody");
        }
    }
});

// LOGI
server.listen(PORT, () => {
    console.log("Data uruchomienia:", new Date().toString());
    console.log("Autor:", AUTHOR);
    console.log("Port:", PORT);
});
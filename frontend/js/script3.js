document.addEventListener("DOMContentLoaded", () => {
    const checkboxes = document.querySelectorAll(".ders-tik");

    // Bugünün tarihini ve saatini alıyoruz
    const simdi = new Date();
    const bugunTarihKodu = simdi.getFullYear() + "-" + (simdi.getMonth() + 1) + "-" + simdi.getDate();
    
    // Hafızada en son hangi gün işlem yapıldığını kontrol et
    const sonIslemTarihi = localStorage.getItem("sonIslemTarihi");

    // 🚨 SAAT 10:00 SIFIRLAMA KONTROLÜ
    // Eğer dün (veya daha önce) tik atıldıysa VE şu an saat sabah 10:00'u geçtiyse hafızayı temizle
    if (sonIslemTarihi && sonIslemTarihi !== bugunTarihKodu) {
        if (simdi.getHours() >= 10) {
            localStorage.clear(); // Saat 10:00'u geçtiği için dünün tiklerini uçur!
            localStorage.setItem("sonIslemTarihi", bugunTarihKodu); // Bugünü kaydet ki bugün attığın tikler silinmesin
        }
    }

    // Eğer sıfırlama olmadıysa, mevcut tikleri hafızadan çekip ekrana bas
    checkboxes.forEach(box => {
        const tikliMi = localStorage.getItem(box.id) === "true";
        box.checked = tikliMi;
    });

    // Kutulardan birine tıklandığında anında hafızaya kaydet
    checkboxes.forEach(box => {
        box.addEventListener("change", (e) => {
            localStorage.setItem(box.id, e.target.checked);
            // İşlem yapılan bugünün tarihini hafızaya kilitle
            localStorage.setItem("sonIslemTarihi", bugunTarihKodu);
        });
    });
});
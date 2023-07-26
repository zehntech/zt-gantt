/* =========================================================
 * Created by Sunil Solanki
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ========================================================= */

(function (global) {
  var ZTGantt = function (element, options, templates) {
    this.element = element;
    this.initializeOptions(options);
    this.initTemplates(templates);
    this.init();
  };

  ZTGantt.prototype = {
    constructor: ZTGantt,

    // initialize Options
    initializeOptions: function (opt) {
      if (opt == null) {
        opt = {};
      }
      this.options = {
        date_format: opt.date_format,
        columns: opt.columns || [],
        rightGrid: opt.rightGrid,
        data: opt.data || [],
        collapse: opt.collapse !== undefined ? opt.collapse : true,
        fullWeek: opt.fullWeek !== undefined ? opt.fullWeek : true,
        todayMarker: opt.todayMarker !== undefined ? opt.todayMarker : true,
        weekends: opt.weekends || [],
        startDate: opt.startDate,
        endDate: opt.endDate,
        zoomLevel: opt.zoomLevel || "day",
        zoomConfig: opt.zoomConfig || {
          levels: [{ unit: "day", step: 1, format: "%d" }],
        },
        scales: opt.scales || [{ unit: "day", step: 1, format: "%d" }],
        minColWidth: 80,
        openedTasks: [],
        selectedRow: "",
        weekStart: opt.weekStart || 1,
        scale_height: opt.scale_height || 30,
        row_height: opt.row_height || 50,
        sidebarWidth: opt.sidebarWidth || 400,
        customMarker: opt.customMarker || [],
        fullCell: opt.fullCell || true,
        taskColor: opt.taskColor || false,
        taskOpacity: opt.taskOpacity || 0.8,
        addLinks: opt.addLinks || false,
        links: opt.links || [],
        arrangeData: true,
        addTaskOnDrag: opt.addTaskOnDrag || false,
        taskProgress: opt.taskProgress || false,
        dateFormat: {
          month_full: [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December",
          ],
          month_short: [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ],
          day_full: [
            "Sunday",
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          day_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        },
        i18n: {
          hi: {
            month_full: [
              "जनवरी",
              "फ़रवरी",
              "मार्च",
              "अप्रैल",
              "मई",
              "जून",
              "जुलाई",
              "अगस्त",
              "सितंबर",
              "अक्टूबर",
              "नवंबर",
              "दिसंबर",
            ],
            month_short: [
              "जनवरी",
              "फ़रवरी",
              "मार्च",
              "अप्रैल",
              "मई",
              "जून",
              "जुलाई",
              "अगस्त",
              "सितंबर",
              "अक्टूबर",
              "नवंबर",
              "दिसंबर",
            ],
            day_full: [
              "रविवार",
              "सोमवार",
              "मंगलवार",
              "बुधवार",
              "गुरुवार",
              "शुक्रवार",
              "शनिवार",
            ],
            day_short: ["रवि", "सोम", "मंगल", "बुध", "गुरु", "शुक्र", "शनि"],
            label: {
              description: "विवरण",
            },
            buttons: {
              save: "जमा करे",
              cancel: "रद्द करे",
              delete: "मिटाये",
            },
          },
          en: {
            month_full: [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ],
            month_short: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            day_full: [
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ],
            day_short: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
            label: {
              description: "Description",
            },
            buttons: {
              save: "Save",
              cancel: "Cancel",
              delete: "Delete",
            },
          },
          fr: {
            month_full: [
              "Janvier",
              "Février",
              "Mars",
              "Avril",
              "Mai",
              "Juin",
              "Juillet",
              "Août",
              "Septembre",
              "Octobre",
              "Novembre",
              "Décembre",
            ],
            month_short: [
              "Jan",
              "Fév",
              "Mar",
              "Avr",
              "Mai",
              "Juin",
              "Juil",
              "Aoû",
              "Sep",
              "Oct",
              "Nov",
              "Déc",
            ],
            day_full: [
              "Dimanche",
              "Lundi",
              "Mardi",
              "Mercredi",
              "Jeudi",
              "Vendredi",
              "Samedi",
            ],
            day_short: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
            label: {
              description: "Description",
            },
            buttons: {
              save: "Sauvegarder",
              cancel: "Annuler",
              delete: "Effacer",
            },
          },
          de: {
            month_full: [
              "Januar",
              "Februar",
              "März ",
              "April",
              "Mai",
              "Juni",
              "Juli",
              "August",
              "September ",
              "Oktober",
              "November ",
              "Dezember",
            ],
            month_short: [
              "Jan",
              "Feb",
              "Mär",
              "Apr",
              "Mai",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Okt",
              "Nov",
              "Dez",
            ],
            day_full: [
              "Sonntag",
              "Montag",
              "Dienstag",
              "Mittwoch",
              "Donnerstag",
              "Freitag",
              "Samstag",
            ],
            day_short: ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"],
            label: {
              description: "Beschreibung",
            },
            buttons: {
              save: "Speichern",
              cancel: "Abbrechen",
              delete: "Löschen",
            },
          },
          ja: {
            month_full: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月",
            ],
            month_short: [
              "1月",
              "2月",
              "3月",
              "4月",
              "5月",
              "6月",
              "7月",
              "8月",
              "9月",
              "10月",
              "11月",
              "12月",
            ],
            day_full: [
              "日曜日",
              "月曜日",
              "火曜日",
              "水曜日",
              "木曜日",
              "金曜日",
              "土曜日",
            ],
            day_short: ["太陽", "月", "火", "結婚した", "木", "金", "土"],
            label: {
              description: "説明",
            },
            buttons: {
              save: "保存する",
              cancel: "キャンセル",
              delete: "削除",
            },
          },
          ar: {
            month_full: [
              "كانون الثاني",
              "شباط",
              "آذار",
              "نيسان",
              "أيار",
              "حزيران",
              "تموز",
              "آب",
              "أيلول",
              "تشرين الأول",
              "تشرين الثاني",
              "كانون الأول",
            ],
            month_short: [
              "يناير",
              "فبراير",
              "مارس",
              "أبريل",
              "مايو",
              "يونيو",
              "يوليو",
              "أغسطس",
              "سبتمبر",
              "أكتوبر",
              "نوفمبر",
              "ديسمبر",
            ],
            day_full: [
              "الأحد",
              "الأثنين",
              "ألثلاثاء",
              "الأربعاء",
              "ألحميس",
              "ألجمعة",
              "السبت",
            ],
            day_short: [
              "احد",
              "اثنين",
              "ثلاثاء",
              "اربعاء",
              "خميس",
              "جمعة",
              "سبت",
            ],
            label: {
              description: "وصف",
            },
            buttons: {
              save: "يحفظ",
              cancel: "يلغي",
              delete: "يمسح",
            },
          },
          be: {
            month_full: [
              "Студзень",
              "Люты",
              "Сакавік",
              "Красавік",
              "Maй",
              "Чэрвень",
              "Ліпень",
              "Жнівень",
              "Верасень",
              "Кастрычнік",
              "Лістапад",
              "Снежань",
            ],
            month_short: [
              "Студз",
              "Лют",
              "Сак",
              "Крас",
              "Maй",
              "Чэр",
              "Ліп",
              "Жнів",
              "Вер",
              "Каст",
              "Ліст",
              "Снеж",
            ],
            day_full: [
              "Нядзеля",
              "Панядзелак",
              "Аўторак",
              "Серада",
              "Чацвер",
              "Пятніца",
              "Субота",
            ],
            day_short: ["Нд", "Пн", "Аўт", "Ср", "Чцв", "Пт", "Сб"],
            label: {
              description: "Апісанне",
            },
            buttons: {
              save: "Захаваць",
              cancel: "Адмяніць",
              delete: "Выдаліць",
            },
          },
          ca: {
            month_full: [
              "Gener",
              "Febrer",
              "Març",
              "Abril",
              "Maig",
              "Juny",
              "Juliol",
              "Agost",
              "Setembre",
              "Octubre",
              "Novembre",
              "Desembre",
            ],
            month_short: [
              "Gen",
              "Feb",
              "Mar",
              "Abr",
              "Mai",
              "Jun",
              "Jul",
              "Ago",
              "Set",
              "Oct",
              "Nov",
              "Des",
            ],
            day_full: [
              "Diumenge",
              "Dilluns",
              "Dimarts",
              "Dimecres",
              "Dijous",
              "Divendres",
              "Dissabte",
            ],
            day_short: ["Dg", "Dl", "Dm", "Dc", "Dj", "Dv", "Ds"],
            label: {
              description: "Descripció",
            },
            buttons: {
              save: "Desa",
              cancel: "Cancel · lar",
              delete: "Suprimeix",
            },
          },
          cn: {
            month_full: [
              "一月",
              "二月",
              "三月",
              "四月",
              "五月",
              "六月",
              "七月",
              "八月",
              "九月",
              "十月",
              "十一月",
              "十二月",
            ],
            month_short: [
              "简",
              "二月",
              "三月",
              "四月",
              "可能",
              "君",
              "七月",
              "八月",
              "九月",
              "十月",
              "十一月",
              "十二月",
            ],
            day_full: [
              "星期日",
              "星期一",
              "星期二",
              "星期三",
              "星期四",
              "星期五",
              "星期六",
            ],
            day_short: [
              "太阳",
              "星期一",
              "星期二",
              "星期三",
              "星期四",
              "星期五",
              "星期六",
            ],
            label: {
              description: "描述",
            },
            buttons: {
              save: "节省",
              cancel: "取消",
              delete: "删除",
            },
          },
          hr: {
            month_full: [
              "Siječanj",
              "Veljača",
              "Ožujak",
              "Travanj",
              "Svibanj",
              "Lipanj",
              "Srpanj",
              "Kolovoz",
              "Rujan",
              "Listopad",
              "Studeni",
              "Prosinac",
            ],
            month_short: [
              "Sij",
              "Velj",
              "Ožu",
              "Tra",
              "Svi",
              "Lip",
              "Srp",
              "Kol",
              "Ruj",
              "Lis",
              "Stu",
              "Pro",
            ],
            day_full: [
              "Nedjelja",
              "Ponedjeljak",
              "Utorak",
              "Srijeda",
              "Četvrtak",
              "Petak",
              "Subota",
            ],
            day_short: ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"],
            label: {
              description: "Opis",
            },
            buttons: {
              save: "Uštedjeti",
              cancel: "Otkazati",
              delete: "Izbrisati",
            },
          },
          cs: {
            month_full: [
              "Leden",
              "Únor",
              "Březen",
              "Duben",
              "Květen",
              "Červen",
              "Červenec",
              "Srpen",
              "Září",
              "Říjen",
              "Listopad",
              "Prosinec",
            ],
            month_short: [
              "Led",
              "Ún",
              "Bře",
              "Dub",
              "Kvě",
              "Čer",
              "Čec",
              "Srp",
              "Září",
              "Říj",
              "List",
              "Pro",
            ],
            day_full: [
              "Neděle",
              "Pondělí",
              "Úterý",
              "Středa",
              "Čtvrtek",
              "Pátek",
              "Sobota",
            ],
            day_short: ["Ne", "Po", "Út", "St", "Čt", "Pá", "So"],
            label: {
              description: "Popis",
            },
            buttons: {
              save: "Uložit",
              cancel: "zrušení",
              delete: "Vymazat",
            },
          },
          da: {
            month_full: [
              "Januar",
              "Februar",
              "Mars",
              "April",
              "Mai",
              "Juni",
              "Juli",
              "August",
              "September",
              "Oktober",
              "November",
              "Desember",
            ],
            month_short: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "Mai",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Okt",
              "Nov",
              "Des",
            ],
            day_full: [
              "Søndag",
              "Mandag",
              "Tirsdag",
              "Onsdag",
              "Torsdag",
              "Fredag",
              "Lørdag",
            ],
            day_short: ["Søn", "Man", "Tir", "Ons", "Tor", "Fre", "Lør"],
            label: {
              description: "Beskrivelse",
            },
            buttons: {
              save: "Gemme",
              cancel: "Afbestille",
              delete: "Slet",
            },
          },
          nl: {
            month_full: [
              "Januari",
              "Februari",
              "Maart",
              "April",
              "Mei",
              "Juni",
              "Juli",
              "Augustus",
              "September",
              "Oktober",
              "November",
              "December",
            ],
            month_short: [
              "Jan",
              "Feb",
              "mrt",
              "Apr",
              "Mei",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Okt",
              "Nov",
              "Dec",
            ],
            day_full: [
              "Zondag",
              "Maandag",
              "Dinsdag",
              "Woensdag",
              "Donderdag",
              "Vrijdag",
              "Zaterdag",
            ],
            day_short: ["Zo", "Ma", "Di", "Wo", "Do", "Vr", "Za"],
            label: {
              description: "Beschrijving",
            },
            buttons: {
              save: "Redden",
              cancel: "Annuleren",
              delete: "Verwijderen",
            },
          },
          fi: {
            month_full: [
              "Tammikuu",
              "Helmikuu",
              "Maaliskuu",
              "Huhtikuu",
              "Toukokuu",
              "Kes&auml;kuu",
              "Hein&auml;kuu",
              "Elokuu",
              "Syyskuu",
              "Lokakuu",
              "Marraskuu",
              "Joulukuu",
            ],
            month_short: [
              "Tam",
              "Hel",
              "Maa",
              "Huh",
              "Tou",
              "Kes",
              "Hei",
              "Elo",
              "Syy",
              "Lok",
              "Mar",
              "Jou",
            ],
            day_full: [
              "Sunnuntai",
              "Maanantai",
              "Tiistai",
              "Keskiviikko",
              "Torstai",
              "Perjantai",
              "Lauantai",
            ],
            day_short: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
            label: {
              description: "Kuvaus",
            },
            buttons: {
              save: "Tallentaa",
              cancel: "Peruuttaa",
              delete: "Poistaa",
            },
          },
          el: {
            month_full: [
              "Ιανουάριος",
              "Φεβρουάριος",
              "Μάρτιος",
              "Απρίλιος",
              "Μάϊος",
              "Ιούνιος",
              "Ιούλιος",
              "Αύγουστος",
              "Σεπτέμβριος",
              "Οκτώβριος",
              "Νοέμβριος",
              "Δεκέμβριος",
            ],
            month_short: [
              "ΙΑΝ",
              "ΦΕΒ",
              "ΜΑΡ",
              "ΑΠΡ",
              "ΜΑΙ",
              "ΙΟΥΝ",
              "ΙΟΥΛ",
              "ΑΥΓ",
              "ΣΕΠ",
              "ΟΚΤ",
              "ΝΟΕ",
              "ΔΕΚ",
            ],
            day_full: [
              "Κυριακή",
              "Δευτέρα",
              "Τρίτη",
              "Τετάρτη",
              "Πέμπτη",
              "Παρασκευή",
              "Κυριακή",
            ],
            day_short: ["ΚΥ", "ΔΕ", "ΤΡ", "ΤΕ", "ΠΕ", "ΠΑ", "ΣΑ"],
            label: {
              description: "Περιγραφή",
            },
            buttons: {
              save: "Αποθηκεύσετε",
              cancel: "Ματαίωση",
              delete: "Διαγράφω",
            },
          },
          hu: {
            month_full: [
              "Január",
              "Február",
              "Március",
              "Április",
              "Május",
              "Június",
              "Július",
              "Augusztus",
              "Szeptember",
              "Október",
              "November",
              "December",
            ],
            month_short: [
              "Jan",
              "Feb",
              "Már",
              "Ápr",
              "Máj",
              "Jún",
              "Júl",
              "Aug",
              "Sep",
              "Okt",
              "Nov",
              "Dec",
            ],
            day_full: [
              "Vasárnap",
              "Hétfõ",
              "Kedd",
              "Szerda",
              "Csütörtök",
              "Péntek",
              "szombat",
            ],
            day_short: ["Va", "Hé", "Ke", "Sze", "Csü", "Pé", "Szo"],
            label: {
              description: "Leírás",
            },
            buttons: {
              save: "Megment",
              cancel: "Megszünteti",
              delete: "Töröl",
            },
          },
          id: {
            month_full: [
              "Januari",
              "Februari",
              "Maret",
              "April",
              "Mei",
              "Juni",
              "Juli",
              "Agustus",
              "September",
              "Oktober",
              "November",
              "Desember",
            ],
            month_short: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "Mei",
              "Jun",
              "Jul",
              "Ags",
              "Sep",
              "Okt",
              "Nov",
              "Des",
            ],
            day_full: [
              "Minggu",
              "Senin",
              "Selasa",
              "Rabu",
              "Kamis",
              "Jumat",
              "Sabtu",
            ],
            day_short: ["Ming", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
            label: {
              description: "Keterangan",
            },
            buttons: {
              save: "Menyimpan",
              cancel: "Membatalkan",
              delete: "Menghapus",
            },
          },
          it: {
            month_full: [
              "Gennaio",
              "Febbraio",
              "Marzo",
              "Aprile",
              "Maggio",
              "Giugno",
              "Luglio",
              "Agosto",
              "Settembre",
              "Ottobre",
              "Novembre",
              "Dicembre",
            ],
            month_short: [
              "Gen",
              "Feb",
              "Mar",
              "Apr",
              "Mag",
              "Giu",
              "Lug",
              "Ago",
              "Set",
              "Ott",
              "Nov",
              "Dic",
            ],
            day_full: [
              "Domenica",
              "Lunedì",
              "Martedì",
              "Mercoledì",
              "Giovedì",
              "Venerdì",
              "Sabato",
            ],
            day_short: ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"],
            label: {
              description: "Descrizione",
            },
            buttons: {
              save: "Salva",
              cancel: "Annulla",
              delete: "Eliminare",
            },
          },
          kr: {
            month_full: [
              "1월",
              "2월",
              "3월",
              "4월",
              "5월",
              "6월",
              "7월",
              "8월",
              "9월",
              "10월",
              "11월",
              "12월",
            ],
            month_short: [
              "1월",
              "2월",
              "3월",
              "4월",
              "5월",
              "6월",
              "7월",
              "8월",
              "9월",
              "10월",
              "11월",
              "12월",
            ],
            day_full: [
              "일요일",
              "월요일",
              "화요일",
              "수요일",
              "목요일",
              "금요일",
              "토요일",
            ],
            day_short: ["일", "월", "화", "수", "목", "금", "토"],
            label: {
              description: "설명",
            },
            buttons: {
              save: "구하다",
              cancel: "취소",
              delete: "삭제",
            },
          },
          fa: {
            month_full: [
              "ژانویه",
              "فوریه",
              "مارس",
              "آوریل",
              "مه",
              "ژوئن",
              "ژوئیه",
              "اوت",
              "سپتامبر",
              "اکتبر",
              "نوامبر",
              "دسامبر",
            ],
            month_short: [
              "1",
              "2",
              "3",
              "4",
              "5",
              "6",
              "7",
              "8",
              "9",
              "10",
              "11",
              "12",
            ],
            day_full: [
              "يکشنبه",
              "دوشنبه",
              "سه‌شنبه",
              "چهارشنبه",
              "پنجشنبه",
              "جمعه",
              "شنبه",
            ],
            day_short: ["ی", "د", "س", "چ", "پ", "ج", "ش"],
            label: {
              description: "شرح",
            },
            buttons: {
              save: "صرفه جویی",
              cancel: "لغو کنید",
              delete: "حذف",
            },
          },
          pl: {
            month_full: [
              "Styczeń",
              "Luty",
              "Marzec",
              "Kwiecień",
              "Maj",
              "Czerwiec",
              "Lipiec",
              "Sierpień",
              "Wrzesień",
              "Październik",
              "Listopad",
              "Grudzień",
            ],
            month_short: [
              "Sty",
              "Lut",
              "Mar",
              "Kwi",
              "Maj",
              "Cze",
              "Lip",
              "Sie",
              "Wrz",
              "Paź",
              "Lis",
              "Gru",
            ],
            day_full: [
              "Niedziela",
              "Poniedziałek",
              "Wtorek",
              "Środa",
              "Czwartek",
              "Piątek",
              "Sobota",
            ],
            day_short: ["Nie", "Pon", "Wto", "Śro", "Czw", "Pią", "Sob"],
            label: {
              description: "Opis",
            },
            buttons: {
              save: "Ratować",
              cancel: "Anulować",
              delete: "Usuwać",
            },
          },
          pt: {
            month_full: [
              "Janeiro",
              "Fevereiro",
              "Março",
              "Abril",
              "Maio",
              "Junho",
              "Julho",
              "Agosto",
              "Setembro",
              "Outubro",
              "Novembro",
              "Dezembro",
            ],
            month_short: [
              "Jan",
              "Fev",
              "Mar",
              "Abr",
              "Mai",
              "Jun",
              "Jul",
              "Ago",
              "Set",
              "Out",
              "Nov",
              "Dez",
            ],
            day_full: [
              "Domingo",
              "Segunda",
              "Terça",
              "Quarta",
              "Quinta",
              "Sexta",
              "Sábado",
            ],
            day_short: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
            label: {
              description: "Descrição",
            },
            buttons: {
              save: "Salvar",
              cancel: "Cancelar",
              delete: "Excluir",
            },
          },
          ro: {
            month_full: [
              "Ianuarie",
              "Februarie",
              "Martie",
              "Aprilie",
              "Mai",
              "Iunie",
              "Iulie",
              "August",
              "Septembrie",
              "Octombrie",
              "November",
              "December",
            ],
            month_short: [
              "Ian",
              "Feb",
              "Mar",
              "Apr",
              "Mai",
              "Iun",
              "Iul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            day_full: [
              "Duminica",
              "Luni",
              "Marti",
              "Miercuri",
              "Joi",
              "Vineri",
              "Sambata",
            ],
            day_short: ["Du", "Lu", "Ma", "Mi", "Jo", "Vi", "Sa"],
            label: {
              description: "Descriere",
            },
            buttons: {
              save: "Salvați",
              cancel: "Anulare",
              delete: "Șterge",
            },
          },
          ru: {
            month_full: [
              "Январь",
              "Февраль",
              "Март",
              "Апрель",
              "Maй",
              "Июнь",
              "Июль",
              "Август",
              "Сентябрь",
              "Oктябрь",
              "Ноябрь",
              "Декабрь",
            ],
            month_short: [
              "Янв",
              "Фев",
              "Maр",
              "Aпр",
              "Maй",
              "Июн",
              "Июл",
              "Aвг",
              "Сен",
              "Окт",
              "Ноя",
              "Дек",
            ],
            day_full: [
              "Воскресенье",
              "Понедельник",
              "Вторник",
              "Среда",
              "Четверг",
              "Пятница",
              "Суббота",
            ],
            day_short: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
            label: {
              description: "Описание",
            },
            buttons: {
              save: "Сохранять",
              cancel: "Отмена",
              delete: "Удалить",
            },
          },
          si: {
            month_full: [
              "Januar",
              "Februar",
              "Marec",
              "April",
              "Maj",
              "Junij",
              "Julij",
              "Avgust",
              "September",
              "Oktober",
              "November",
              "December",
            ],
            month_short: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "Maj",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Okt",
              "Nov",
              "Dec",
            ],
            day_full: [
              "Nedelja",
              "Ponedeljek",
              "Torek",
              "Sreda",
              "Četrtek",
              "Petek",
              "Sobota",
            ],
            day_short: ["Ned", "Pon", "Tor", "Sre", "Čet", "Pet", "Sob"],
            label: {
              description: "Opis",
            },
            buttons: {
              save: "Shrani",
              cancel: "Prekliči",
              delete: "Izbriši",
            },
          },
          es: {
            month_full: [
              "Enero",
              "Febrero",
              "Marzo",
              "Abril",
              "Mayo",
              "Junio",
              "Julio",
              "Agosto",
              "Septiembre",
              "Octubre",
              "Noviembre",
              "Diciembre",
            ],
            month_short: [
              "Ene",
              "Feb",
              "Mar",
              "Abr",
              "May",
              "Jun",
              "Jul",
              "Ago",
              "Sep",
              "Oct",
              "Nov",
              "Dic",
            ],
            day_full: [
              "Domingo",
              "Lunes",
              "Martes",
              "Miércoles",
              "Jueves",
              "Viernes",
              "Sábado",
            ],
            day_short: ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"],
            label: {
              description: "Descripción",
            },
            buttons: {
              save: "Ahorrar",
              cancel: "Cancelar",
              delete: "Borrar",
            },
          },
          sv: {
            month_full: [
              "Januari",
              "Februari",
              "Mars",
              "April",
              "Maj",
              "Juni",
              "Juli",
              "Augusti",
              "September",
              "Oktober",
              "November",
              "December",
            ],
            month_short: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "Maj",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Okt",
              "Nov",
              "Dec",
            ],
            day_full: [
              "Söndag",
              "Måndag",
              "Tisdag",
              "Onsdag",
              "Torsdag",
              "Fredag",
              "Lördag",
            ],
            day_short: ["Sön", "Mån", "Tis", "Ons", "Tor", "Fre", "Lör"],
            label: {
              description: "Beskrivning",
            },
            buttons: {
              save: "Spara",
              cancel: "Annullera",
              delete: "Radera",
            },
          },
          tr: {
            month_full: [
              "Ocak",
              "Şubat",
              "Mart",
              "Nisan",
              "Mayıs",
              "Haziran",
              "Temmuz",
              "Ağustos",
              "Eylül",
              "Ekim",
              "Kasım",
              "Aralık",
            ],
            month_short: [
              "Oca",
              "Şub",
              "Mar",
              "Nis",
              "May",
              "Haz",
              "Tem",
              "Ağu",
              "Eyl",
              "Eki",
              "Kas",
              "Ara",
            ],
            day_full: [
              "Pazar",
              "Pazartesi",
              "Salı",
              "Çarşamba",
              "Perşembe",
              "Cuma",
              "Cumartesi",
            ],
            day_short: ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"],
            label: {
              description: "Tanım",
            },
            buttons: {
              save: "Kaydetmek",
              cancel: "İptal etmek",
              delete: "Silmek",
            },
          },
          ua: {
            month_full: [
              "Січень",
              "Лютий",
              "Березень",
              "Квітень",
              "Травень",
              "Червень",
              "Липень",
              "Серпень",
              "Вересень",
              "Жовтень",
              "Листопад",
              "Грудень",
            ],
            month_short: [
              "Січ",
              "Лют",
              "Бер",
              "Кві",
              "Тра",
              "Чер",
              "Лип",
              "Сер",
              "Вер",
              "Жов",
              "Лис",
              "Гру",
            ],
            day_full: [
              "Неділя",
              "Понеділок",
              "Вівторок",
              "Середа",
              "Четвер",
              "П'ятниця",
              "Субота",
            ],
            day_short: ["Нед", "Пон", "Вів", "Сер", "Чет", "Птн", "Суб"],
            label: {
              description: "опис",
            },
            buttons: {
              save: "зберегти",
              cancel: "Скасувати",
              delete: "Видалити",
            },
          },
          he: {
            month_full: [
              "ינואר",
              "פברואר",
              "מרץ",
              "אפריל",
              "מאי",
              "יוני",
              "יולי",
              "אוגוסט",
              "ספטמבר",
              "אוקטובר",
              "נובמבר",
              "דצמבר",
            ],
            month_short: [
              "ינואר",
              "פברואר",
              "מרץ",
              "אפריל",
              "מאי",
              "יוני",
              "יולי",
              "אוגוסט",
              "ספטמבר",
              "אוקטובר",
              "נובמבר",
              "דצמבר",
            ],
            day_full: [
              "יוֹם רִאשׁוֹן",
              "יוֹם שֵׁנִי",
              "יוֹם שְׁלִישִׁי",
              "יום רביעי",
              "יוֹם חֲמִישִׁי",
              "יוֹם שִׁישִׁי",
              "יום שבת",
            ],
            day_short: [
              "שמש",
              "יום שני",
              "ג'",
              "היינו עושים",
              "יום ה'",
              "שישי",
              "ישב",
            ],
            label: {
              description: "תיאור",
            },
            buttons: {
              save: "להציל",
              cancel: "לְבַטֵל",
              delete: "לִמְחוֹק",
            },
          },
          no: {
            month_full: [
              "januar",
              "februar",
              "mars",
              "april",
              "Kan",
              "juni",
              "juli",
              "august",
              "september",
              "oktober",
              "november",
              "desember",
            ],
            month_short: [
              "Jan",
              "feb",
              "Mar",
              "apr",
              "Kan",
              "jun",
              "jul",
              "august",
              "sep",
              "okt",
              "nov",
              "des",
            ],
            day_full: [
              "søndag",
              "Monday",
              "tirsdag",
              "onsdag",
              "Torsdag",
              "fredag",
              "lørdag",
            ],
            day_short: ["Søn", "man", "tirs", "ons", "tor", "fre", "Lør"],
            label: {
              description: "Beskrivelse",
            },
            buttons: {
              save: "Lagre",
              cancel: "Avbryt",
              delete: "Slett",
            },
          },
          sk: {
            month_full: [
              "Január",
              "február",
              "marec",
              "apríl",
              "máj",
              "jún",
              "júl",
              "august",
              "september",
              "október",
              "november",
              "december",
            ],
            month_short: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "máj",
              "Jun",
              "júl",
              "Aug",
              "Sep",
              "október",
              "Nov",
              "Dec",
            ],
            day_full: [
              "Nedeľa",
              "pondelok",
              "utorok",
              "streda",
              "štvrtok",
              "piatok",
              "sobota",
            ],
            day_short: ["Ne", "Po", "Ut", "St", "Št", "Pia", "So"],
            label: {
              description: "Popis",
            },
            buttons: {
              save: "Uložiť",
              cancel: "Zrušiť",
              delete: "Odstrániť",
            },
          },
        },
        localLang: opt.localLang || "en",
        currentLanguage: {},
      };
    },

    // initialize templates
    initTemplates: function (templ) {
      if (templ == null) {
        templ = {};
      }

      this.templates = {
        tooltip_text:
          templ.tooltip_text ||
          function (start, end, task) {
            return (
              "<b>Task:</b> " +
              task.text +
              "<br/><b>Start date:</b> " +
              start +
              "<br/><b>End date:</b> " +
              end
            );
          },
        taskbar_text:
          templ.taskbar_text ||
          function (start, end, task) {
            return task.text;
          },
        task_drag:
          templ.task_drag ||
          function (mode, task) {
            return true;
          },
        grid_folder:
          templ.grid_folder ||
          function (task) {
            return " ";
          },
        grid_file:
          templ.grid_file ||
          function (task) {
            return " ";
          },
        showLightBox: templ.showLightBox || undefined,
        grid_header_class: templ.grid_header_class || undefined,
        grid_row_class: templ.grid_row_class || undefined,
        task_class: templ.task_class || undefined,
        task_row_class: templ.task_row_class || undefined,
        scale_cell_class: templ.scale_cell_class || undefined,
        grid_cell_class: templ.grid_cell_class || undefined,
        timeline_cell_class: templ.timeline_cell_class || undefined,
      };
    },

    // get array of dates between the range of dates
    getDates(startDate, endDate) {
      if (typeof startDate !== "number") {
        startDate = new Date(startDate).setHours(0, 0, 0, 0);
      }
      if (typeof endDate !== "number") {
        endDate = new Date(endDate).setHours(0, 0, 0, 0);
      }
      const dates = [];
      let currentDate = startDate;
      const addDays = function (days) {
        const date = new Date(this.valueOf());
        date.setDate(date.getDate() + days);
        return date.setHours(0, 0, 0, 0);
      };
      while (currentDate <= endDate) {
        dates.push(currentDate);
        currentDate = addDays.call(currentDate, 1);
      }
      return dates;
    },

    init: function () {
      let that = this;

      this.options.currentLanguage = this.options.i18n[this.options.localLang];

      /*for Safari below v16 */
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullScreenChangeSafari
      );
      document.addEventListener(
        "webkitfullscreenchange",
        handleFullScreenChangeSafari
      );
      function handleFullScreenChangeSafari() {
        // Check if full screen mode has been exited
        if (!document.webkitIsFullScreen) {
          that.element.classList.remove("zt-gantt-fullScreen");
          that.exitFullScreen(true);
        }
      }

      // Listen for the fullscreenchange event
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
      document.addEventListener("fullscreenchange", handleFullScreenChange);
      function handleFullScreenChange() {
        // Check if full screen mode has been exited
        if (!document.fullscreenElement) {
          that.element.classList.remove("zt-gantt-fullScreen");
          that.exitFullScreen(true);
        }
      }

      window.removeEventListener("resize", handleResize);
      window.addEventListener("resize", handleResize);

      function handleResize(event) {
        if (
          that.calculateTimeLineWidth("updated") !==
          that.calculateTimeLineWidth("current")
        ) {
          that.updateBody();
        }

        // handle custom event
        const onResize = new CustomEvent("onResize", {
          detail: {
            event: event,
          },
        });
        that.element.dispatchEvent(onResize);
      }

      let tooltip = document.createElement("div");
      tooltip.classList.add("zt-gantt-tooltip");
      tooltip.id = "zt-gantt-tooltip";
      tooltip.style.display = "none";
      let isTooltipExist = document.querySelector("#zt-gantt-tooltip");
      if (isTooltipExist) isTooltipExist.remove();
      document.body.append(tooltip);
    },

    // render the zt-gantt chart
    render: function (ele = this.element) {
      if (
        this.options.weekStart > 6 ||
        typeof this.options.weekStart !== "number"
      ) {
        let message =
          this.options.weekStart > 6
            ? "enter week start between 0 to 6"
            : "type of week start should be number!";
        this.toastr("Error", message, "error");
      }
      if (!this.options.date_format) {
        this.toastr(
          "Error",
          `date_format is ${this.options.date_format}, please provide a valid date format of your data date format`,
          "error"
        );
      }

      this.element = ele || this.element;
      let options = this.options;
      this.options.currentLanguage = this.options.i18n[this.options.localLang];
      this.zoomInit("initial");
      function createNestedTree(
        flatArray,
        parentIdKey = "parent",
        idKey = "id"
      ) {
        const tree = [];

        const map = {};
        flatArray.forEach((item) => {
          const id = item[idKey];
          const parentId = item[parentIdKey];

          map[id] = { ...item, children: map[id] ? map[id].children : [] };

          if (!parentId) {
            tree.push(map[id]);
          } else {
            map[parentId] = map[parentId] || { children: [] };
            map[parentId].children.push(map[id]);
          }
        });

        return tree;
      }

      // create a copy of the data and add "_id" key in the all data objects
      if (this.options.arrangeData) {
        this.originalData = [...this.options.data];

        // set _id to all the tasks
        let count = 0;
        for (let i = 0; i < this.originalData.length; i++) {
          this.originalData[i]._id = count;
          count += 1;
        }
      }

      for (let i = 0; i < this.originalData.length; i++) {
        if (
          this.originalData[i].start_date !== undefined &&
          isNaN(new Date(this.originalData[i].start_date)) &&
          this.options.date_format
        ) {
          this.originalData[i].start_date = this.getDateTimeComponents(
            this.originalData[i].start_date
          );
        } else {
          this.hasHours = false;
          if (
            this.originalData[i].start_date !== undefined &&
            isNaN(this.originalData[i].start_date)
          ) {
            this.getDateTimeComponents(this.originalData[i].start_date);
            if (
              this.hasHours !== true &&
              !isNaN(new Date(this.originalData[i].start_date))
            ) {
              this.originalData[i].start_date = new Date(
                new Date(this.originalData[i].start_date).setHours(0, 0, 0, 0)
              );
            }
          }
        }
        if (
          this.originalData[i].end_date !== undefined &&
          isNaN(new Date(this.originalData[i].end_date)) &&
          this.options.date_format
        ) {
          this.originalData[i].end_date = this.getDateTimeComponents(
            this.originalData[i].end_date
          );
        } else {
          this.hasHours = false;
          if (
            this.originalData[i].end_date !== undefined &&
            isNaN(this.originalData[i].end_date)
          ) {
            this.getDateTimeComponents(this.originalData[i].end_date);
            if (
              this.hasHours !== true &&
              !isNaN(new Date(this.originalData[i].end_date))
            ) {
              this.originalData[i].end_date = new Date(
                new Date(this.originalData[i].end_date).setHours(0, 0, 0, 0)
              );
            }
          }
        }
      }

      let nestedData = createNestedTree(this.originalData);
      this.options.data = nestedData;

      // calculate and add duration and start and end date in all data objects
      this.updateTaskDuration();

      this.options.arrangeData = false;

      let startAndEndDate = this.getStartAndEndDate(options.data);
      if (!this.options.startDate) {
        this.options.startDate = startAndEndDate.startDate;
      }
      if (!this.options.endDate) {
        this.options.endDate = startAndEndDate.endDate;
      }
      this.dates = this.getDates(options.startDate, options.endDate);
      let dates = this.dates;
      const weekday = this.options.dateFormat.day_short;
      if (!options.fullWeek) {
        dates = dates.filter((date) => {
          return !options.weekends.includes(weekday[new Date(date).getDay()]);
        });
        this.dates = dates;
      }

      // set all task expanded initially if collapse is false
      if (!options.collapse && options.openedTasks.length === 0) {
        let openedTasks = [];

        for (let i = 0; i < this.options.data.length; i++) {
          openedTasks.push(this.options.data[i].id);
          if (this.options.data[i].children) {
            openedTasks = this.setAllExpand(
              this.options.data[i].children,
              openedTasks
            );
          }
        }
        this.options.openedTasks = [...new Set(openedTasks)];
      }

      if (this.fullScreen === true) {
        this.element.classList.add("zt-gantt-fullScreen");
      }

      let mainContainer = document.createElement("div");
      mainContainer.classList.add("zt-gantt-layout", "d-flex");
      mainContainer.id = "zt-gantt-layout";

      this.createSidebar(options, mainContainer);

      let calendar = document.createElement("div");
      calendar.classList.add("zt-gantt-right-cell");
      calendar.id = "zt-gantt-right-cell";

      this.createHeaderScale(dates, calendar, options);
      this.createBody(options, dates, calendar, mainContainer, weekday, true);

      if (options.rightGrid) {
        let newGridOptions = { ...options };
        newGridOptions.columns = options.rightGrid;
        this.createRightSidebar(newGridOptions, mainContainer);
      }

      let tooltip = document.querySelector("#zt-gantt-tooltip");

      this.element.removeEventListener("mousemove", handleMouseMove);
      this.element.addEventListener("mousemove", handleMouseMove);

      if (!tooltip) {
        tooltip = document.createElement("div");
        tooltip.classList.add("zt-gantt-tooltip");
        tooltip.id = "zt-gantt-tooltip";
        tooltip.style.display = "none";
        document.body.append(tooltip);
      }

      function handleMouseMove(e) {
        tooltip.style.top = e.y + 25 + window.scrollY + "px";
        tooltip.style.left = e.x + 10 + window.scrollX + "px";
        if (
          tooltip.offsetLeft + tooltip.offsetWidth >
          window.screen.width - 15
        ) {
          let left = e.x - tooltip.offsetWidth + window.scrollX;
          tooltip.style.left = `${left < 0 ? 0 : left}px`;
        }
        if (
          tooltip.offsetTop + tooltip.offsetHeight >
          document.body.offsetHeight - 5
        ) {
          tooltip.style.top = `${
            e.y - tooltip.offsetHeight + window.scrollY
          }px`;
        }
      }

      verScroll =
        document.querySelector(".zt-gantt-ver-scroll")?.scrollTop || 0;
      horScroll =
        document.querySelector(".zt-gantt-hor-scroll")?.scrollLeft || 0;

      // append zt-gantt-layout in element
      let layout = document.querySelector("#zt-gantt-layout");
      if (layout) {
        layout.replaceWith(mainContainer);
      } else {
        this.element.append(mainContainer);
      }

      this.createScrollbar(
        mainContainer,
        options,
        verScroll || 0,
        horScroll || 0
      );

      // add all markers
      let isMarkerAreaExist = document.querySelector(".zt-gantt-marker-area");
      if (isMarkerAreaExist) {
        isMarkerAreaExist.remove();
      }
      for (let marker of this.options.customMarker) {
        this.addMarkerToGantt(marker);
      }

      // add today marker
      if (options.todayMarker) {
        this.addTodayFlag();
      }

      // create links if addLinks is true
      if (this.options.addLinks === true) {
        let rightDataContainer = document.querySelector("#zt-gantt-scale-data");
        let linksArea = document.createElement("div");
        linksArea.classList.add("zt-gantt-links-area");
        linksArea.id = "zt-gantt-links-area";
        rightDataContainer.append(linksArea);

        for (let i = 0; i < this.options.links.length; i++) {
          this.createLinks(
            this.options.links[i].source,
            this.options.links[i].target,
            this.options.links[i]
          );
        }
      }
    },

    // create left sidebar
    createSidebar: function (options, mainContainer) {
      // sidebar head cells
      let sidebar = document.createElement("div");
      sidebar.classList.add("zt-gantt-left-cell");
      sidebar.id = "zt-gantt-grid-left-data";
      let headCellContainer = document.createElement("div");
      headCellContainer.classList.add("sidebar-head-cell-container");
      let containerHeight = this.calculateScaleHeight(
        options.scales,
        options.scale_height,
        "header",
        0
      );

      const totalWidth = options.columns.reduce(
        (totalWidth, col) => totalWidth + col.width,
        0
      );

      sidebar.style.width = totalWidth + "px";
      sidebar.style.minWidth = totalWidth + "px";

      headCellContainer.style.height = containerHeight;
      headCellContainer.style.lineHeight = containerHeight;

      sidebar.append(headCellContainer);
      let resizerLeft = 0;
      // head loop of left side
      for (let i = 0; i < options.columns.length; i++) {
        let headCell = document.createElement("div");
        headCell.classList.add("head-cell");

        //add custom class from user
        if (typeof this.templates.grid_header_class === "function") {
          let cssClass = this.templates.grid_header_class(
            options.columns[i],
            i
          );
          if (cssClass) {
            cssClass = cssClass.trim().replace(/\s+/g, " ").split(" ");
            headCell.classList.add(...cssClass);
          }
        }

        headCell.setAttribute("data-column-index", i);
        headCell.style.width = (options.columns[i].width || 80) + "px";
        headCell.innerHTML = options.columns[i].label;
        headCellContainer.append(headCell);
        if (i < options.columns.length) {
          let resizerWrap = document.createElement("div");
          resizerWrap.classList.add("zt-gantt-col-resizer-wrap");
          resizerWrap.id = "zt-gantt-col-resizer-wrap-" + i;
          resizerWrap.style.height = this.calculateScaleHeight(
            options.scales,
            options.scale_height,
            "header",
            0
          );

          if (options.columns[i].resize === true) {
            let resizer = document.createElement("div");
            resizer.classList.add("zt-gantt-col-resizer");
            resizerWrap.append(resizer);
            resizerLeft += options.columns[i].width || 80;
            resizerWrap.style.left = resizerLeft + "px";
            headCellContainer.append(resizerWrap);
            this.resizeColumns(
              resizerWrap,
              `data-column-index="${i}"`,
              headCell,
              headCellContainer,
              options.columns[i].min_width,
              options.columns[i].max_width,
              i,
              sidebar,
              false
            );
          }
        }
      }

      // data loop of left side
      let leftDataContainer = document.createElement("div");
      leftDataContainer.classList.add("zt-gantt-grid-data");
      leftDataContainer.id = "zt-gantt-left-grid";

      // loop through all the data
      for (let j = 0; j < options.data.length; j++) {
        if (this.searchedData) {
          this.options.openedTasks.push(options.data[j].id);
        }
        let dataItem = document.createElement("div");
        dataItem.classList.add(
          "zt-gantt-row-item",
          "d-flex",
          this.options.selectedRow === `${options.data[j].id}`
            ? "zt-gantt-selected"
            : "zt-gantt-row-item"
        );

        //add custom classes from user
        if (typeof this.templates.grid_row_class === "function") {
          let startDate, endDate;
          if (Array.isArray(options.data[j].children)) {
            let taskData = [...options.data[j].children];
            let dateData = this.getStartAndEndDate(taskData);
            startDate = dateData.startDate;
            endDate = dateData.endDate;
          }
          let cssClass = this.templates.grid_row_class(
            startDate,
            endDate,
            options.data[j]
          );
          if (cssClass) {
            cssClass = cssClass.trim().replace(/\s+/g, " ").split(" ");
            dataItem.classList.add(...cssClass);
          }
        }

        dataItem.setAttribute("zt-gantt-data-task-id", j);
        dataItem.setAttribute("zt-gantt-task-id", options.data[j].id);
        dataItem.style.height = options.row_height + "px";
        dataItem.style.lineHeight = options.row_height + "px";
        let that = this;

        // handle double click event
        dataItem.addEventListener("dblclick", handleDblClick);

        function handleDblClick(e) {
          if (e.target.classList.contains("zt-gantt-tree-icon")) {
            return;
          }
          that.createLightbox(that.options.data[j]);
          const onTaskDblClick = new CustomEvent("onTaskDblClick", {
            detail: {
              task: that.options.data[j],
            },
          });
          that.element.dispatchEvent(onTaskDblClick);
        }

        let start_date, end_date;
        // Handle mouseover event
        dataItem.addEventListener("mouseover", handleMouseOver);

        function handleMouseOver(e) {
          let tooltip = document.getElementById("zt-gantt-tooltip");
          tooltip.innerHTML = "";
          start_date = options.data[j].start_date;
          end_date = options.data[j].end_date;
          if (options.data[j].children) {
            let taskData = [...options.data[j].children];
            let startAndEndDate = that.getStartAndEndDate(taskData);
            start_date = startAndEndDate.startDate;
            end_date = startAndEndDate.endDate;
          }
          tooltip.innerHTML = that.templates.tooltip_text(
            start_date,
            end_date,
            options.data[j]
          );
          tooltip.style.display = "block";
        }

        // Handle mouseleave event
        dataItem.addEventListener("mouseleave", handleMouseLeave);

        function handleMouseLeave(e) {
          let tooltip = document.getElementById("zt-gantt-tooltip");
          tooltip.innerHTML = "";
          tooltip.style.display = "none";
        }

        this.addClickListener(dataItem, (e) => {
          if (e.target.classList.contains("zt-gantt-tree-icon")) {
            return;
          }

          let selectedRows = document.querySelectorAll(".zt-gantt-selected");
          let selectedTaskBars = document.querySelectorAll(
            ".zt-gantt-selected-task-bar"
          );

          // scroll horizontall scroll
          let horizontalScroll = document.querySelector(".zt-gantt-hor-scroll");
          cellBefore =
            document.querySelector(
              `[zt-gantt-taskbar-id="${options.data[j].id}"]`
            ).offsetLeft - 80;
          if (horizontalScroll) {
            horizontalScroll.scrollLeft = cellBefore < 0 ? 0 : cellBefore;
          }
          for (let item of selectedRows) {
            item.classList.remove("zt-gantt-selected");
          }

          for (let item of selectedTaskBars) {
            item.classList.remove("zt-gantt-selected-task-bar");
          }

          // select the selected task taskBar
          let currentTaskBar = document.querySelector(
            `[zt-gantt-taskbar-id="${options.data[j].id}"]`
          );
          currentTaskBar.classList.add("zt-gantt-selected-task-bar");

          let taskRow = document.querySelectorAll(
            `[zt-gantt-data-task-id="${j}"]`
          );
          for (let item of taskRow) {
            item.classList.add("zt-gantt-selected");
          }
          that.options.selectedRow = `${options.data[j].id}`;
          that.options.selectedTask = `${options.data[j].id}`;
        });

        // loop through all the columns
        for (let k = 0; k < options.columns.length; k++) {
          let cell = document.createElement("div");
          cell.classList.add("zt-gantt-cell");

          //add custom class from user
          if (typeof this.templates.grid_cell_class === "function") {
            let cssClass = this.templates.grid_cell_class(
              options.columns[k],
              options.data[j]
            );
            if (cssClass) {
              cssClass = cssClass.trim().replace(/\s+/g, " ").split(" ");
              cell.classList.add(...cssClass);
            }
          }

          cell.style.width = (options.columns[k].width || 80) + "px";
          options.columns[k].align
            ? (cell.style.textAlign = options.columns[k].align)
            : "";
          options.columns[k].align
            ? (cell.style.justifyContent = options.columns[k].align)
            : "";

          let content = document.createElement("div");
          content.classList.add(
            "zt-gantt-cell-data",
            `${k == 0 ? "d-block" : "zt-gantt-data"}`
          );
          cell.setAttribute("data-column-index", k);

          let ztGanttBlank = document.createElement("div");
          ztGanttBlank.classList.add("zt-gantt-blank");

          // content of the column
          content.innerHTML =
            options.columns[k].template(options.data[j]) ||
            options.data[j][options.columns[k].name] ||
            " ";

          this.attachEvent("onAfterTaskUpdate", (e) => {
            content.innerHTML =
              options.columns[k].template(options.data[j]) ||
              options.data[j][options.columns[k].name] ||
              " ";
          });

          // update content innerHTML on after progress drag
          this.attachEvent("onAfterProgressDrag", (e) => {
            content.innerHTML =
              options.columns[k].template(options.data[j]) ||
              options.data[j][options.columns[k].name] ||
              " ";
          });

          this.attachEvent("onTaskDrag", (e) => {
            content.innerHTML =
              options.columns[k].template(options.data[j]) ||
              options.data[j][options.columns[k].name] ||
              " ";
          });

          this.attachEvent("onAfterTaskDrag", (e) => {
            content.innerHTML =
              options.columns[k].template(options.data[j]) ||
              options.data[j][options.columns[k].name] ||
              " ";
          });

          if (options.columns[k].tree) {
            cell.classList.add("d-flex");

            // folder icon
            let folderIcon = document.createElement("div");
            folderIcon.classList.add("zt-gantt-folder-icon");
            folderIcon.innerHTML = this.templates.grid_folder(options.data[j]);

            if (
              options.data[j].children &&
              options.data[j].children.length > 0
            ) {
              // tree icon
              let treeIcon = document.createElement("div");
              treeIcon.classList.add(
                "zt-gantt-tree-icon",
                !this.options.openedTasks.includes(options.data[j].id)
                  ? "zt-gantt-tree-close"
                  : "zt-gantt-tree-open"
              );
              treeIcon.id = `toggle-tree-${j}`;
              cell.append(treeIcon);

              // toggle children
              let that = this;
              let toggleTreeIcon = treeIcon;
              this.addClickListener(toggleTreeIcon, () => {
                let children = document.getElementsByClassName(
                  `zt-gantt-child-${options.data[j].id}`
                );

                if (toggleTreeIcon.classList.contains("zt-gantt-tree-close")) {
                  that.options.openedTasks.push(options.data[j].id);
                  that.options.openedTasks = [
                    ...new Set(that.options.openedTasks),
                  ];

                  for (const child of that.options.data[j].children) {
                    if (child.children && child.children.length > 0) {
                      that.setCollapseAll(child.children, child.id, "open");
                    }
                  }
                } else {
                  const openedTasks = that.options.openedTasks.indexOf(
                    options.data[j].id
                  );
                  if (openedTasks > -1) {
                    that.options.openedTasks.splice(openedTasks, 1);
                  }

                  for (const child of this.options.data[j].children) {
                    if (child.children && child.children.length > 0) {
                      that.setCollapseAll(child.children, child.id, "collapse");
                    }
                  }
                }

                that.createTaskBars();
                for (let i = 0; i < children.length; i++) {
                  children[i].classList.toggle("d-none");
                  children[i].classList.toggle("d-flex");
                }

                toggleTreeIcon.classList.toggle("zt-gantt-tree-close");
                toggleTreeIcon.classList.toggle("zt-gantt-tree-open");
                that.createScrollbar(mainContainer, options);
              });
            } else {
              cell.append(ztGanttBlank);
            }
            cell.append(folderIcon);
          }
          cell.append(content);
          dataItem.append(cell);
        }

        let isTaskExist = this.getTask(options.data[j].id, this.searchedData);
        if (!this.searchedData || isTaskExist) {
          leftDataContainer.append(dataItem);
        }

        this.createChildTask(
          options.data[j].children,
          options,
          leftDataContainer,
          1,
          j,
          false,
          this.options.openedTasks.includes(options.data[j].id)
        );
      }
      sidebar.append(leftDataContainer);
      mainContainer.append(sidebar);

      let sidebarResizerWrap = document.createElement("div");
      sidebarResizerWrap.classList.add("zt-gantt-left-layout-resizer-wrap");
      sidebarResizerWrap.id = "zt-gantt-left-layout-resizer-wrap";
      sidebarResizerWrap.setAttribute("data-html2canvas-ignore", "true");
      let sidebarResizer = document.createElement("div");
      sidebarResizer.classList.add("zt-gantt-left-layout-resizer");
      sidebarResizerWrap.append(sidebarResizer);
      mainContainer.append(sidebarResizerWrap);
      sidebarResizerWrap.style.left = totalWidth + "px";
      this.resizeSidebar(sidebarResizerWrap, sidebarResizer, sidebar);
    },

    // create header of scale
    createHeaderScale: function (dates, calendar, options) {
      let rightScale = document.createElement("div");
      rightScale.classList.add("zt-gantt-scale");
      rightScale.style.height = this.calculateScaleHeight(
        options.scales,
        options.scale_height,
        "header",
        0
      );

      for (let i = 0; i < options.scales.length; i++) {
        let ZTGanttScale = document.createElement("div");
        ZTGanttScale.classList.add(`zt-gantt-scale-container`);
        ZTGanttScale.style.height = this.calculateScaleHeight(
          options.scales,
          options.scale_height,
          "body",
          i
        );
        ZTGanttScale.style.lineHeight = this.calculateScaleHeight(
          options.scales,
          options.scale_height,
          "body",
          i
        );
        let rangeCount = 0;
        let endDate = new Date(0).getTime();

        for (let j = 0; j < dates.length; j++) {
          if (
            new Date(endDate).getTime() >=
            new Date(dates[j]).setHours(0, 0, 0, 0)
          ) {
            continue;
          }
          let dateFormat =
            typeof options.scales[i].format == "function"
              ? options.scales[i].format(new Date(dates[j]))
              : this.formatDateToString(options.scales[i].format, dates[j]);
          let colDates;

          // if date scale unit is week || month || year || (day && step > 1)
          if (
            (options.scales[i].unit == "day" && options.scales[i].step > 1) ||
            options.scales[i].unit == "week" ||
            options.scales[i].unit == "month" ||
            options.scales[i].unit == "quarter" ||
            options.scales[i].unit == "year"
          ) {
            colDates = this.initColSizes(
              options.scales[i].unit,
              options.scales[i].step,
              dates[j]
            );

            // remove weekoff days
            if (!options.fullWeek) {
              colDates.dateCount = colDates.dateCount.filter((date) => {
                return !options.weekends.includes(
                  options.dateFormat.day_short[new Date(date).getDay()]
                );
              });
            }
          }

          let dateCell = document.createElement("div");
          dateCell.classList.add("zt-gantt-scale-cell");

          //add custom class from user
          if (typeof this.templates.scale_cell_class === "function") {
            let cssClass = this.templates.scale_cell_class(
              dates[j],
              options.scales[i],
              i
            );
            if (cssClass) {
              cssClass = cssClass.trim().replace(/\s+/g, " ").split(" ");
              dateCell.classList.add(...cssClass);
            }
          }

          dateCell.innerHTML = `<span class="date-scale">${dateFormat}</span>`;
          if (
            (options.scales[i].unit == "day" && options.scales[i].step > 1) ||
            options.scales[i].unit == "week" ||
            options.scales[i].unit == "month" ||
            options.scales[i].unit == "quarter" ||
            options.scales[i].unit == "year"
          ) {
            dateCell.style.width =
              colDates.dateCount.length * this.calculateGridWidth(dates[j]) +
              "px";
            dateCell.style.left = rangeCount + "px";
          } else {
            dateCell.style.left =
              j * this.calculateGridWidth(dates[j], "day") + "px";
            dateCell.style.width =
              this.calculateGridWidth(dates[j], "day") + "px";
          }
          let currentDate = new Date(dates[j]).setHours(0, 0, 0, 0);
          if (
            ((options.scales[i].unit == "day" && options.scales[i].step > 1) ||
              options.scales[i].unit == "week" ||
              options.scales[i].unit == "month" ||
              options.scales[i].unit == "quarter" ||
              options.scales[i].unit == "year") &&
            new Date(endDate).getTime() < currentDate
          ) {
            ZTGanttScale.append(dateCell);
            rangeCount +=
              colDates.dateCount.length * this.calculateGridWidth(dates[j]);
            endDate = new Date(colDates.endDate);
          } else if (options.scales[i].unit == "hour") {
            let dateStartHour = new Date(dates[j]).getHours();
            let cellDate = new Date(dates[j]);
            let cellWidth = this.calculateGridWidth(dates[j]);
            for (let k = dateStartHour; k < 24; k++) {
              let hourCell = dateCell.cloneNode(true);

              let dateFormat =
                typeof options.scales[i].format == "function"
                  ? options.scales[i].format(cellDate)
                  : this.formatDateToString(options.scales[i].format, cellDate);

              hourCell.innerHTML = dateFormat;
              cellDate.setHours(k + 1);
              hourCell.style.width = cellWidth + "px";
              hourCell.style.left = rangeCount + "px";
              ZTGanttScale.append(hourCell);
              rangeCount += cellWidth;
            }
          } else if (
            options.scales[i].unit == "day" &&
            options.scales[i].step == 1
          ) {
            ZTGanttScale.append(dateCell);
          }
        }
        rightScale.append(ZTGanttScale);
      }
      rightScale.style.width =
        this.calculateTimeLineWidth("updated", "day") + "px";
      calendar.append(rightScale);
    },

    // create grid body
    createBody: function (
      options,
      dates,
      calendar,
      mainContainer,
      weekday,
      isFromRender = false
    ) {
      let rightDataContainer = document.createElement("div");
      rightDataContainer.classList.add("zt-gantt-scale-data");
      rightDataContainer.id = "zt-gantt-scale-data";
      let ztGanttTaskData = document.createElement("div");
      ztGanttTaskData.classList.add("zt-gantt-task-data");

      // grid data loop
      for (let j = 0; j < options.data.length; j++) {
        let scaleRow = document.createElement("div");
        scaleRow.classList.add(
          "zt-gantt-task-row",
          options.selectedRow === `${options.data[j].id}`
            ? "zt-gantt-selected"
            : "zt-gantt-task-row"
        );

        //add custom classes from user
        if (typeof this.templates.task_row_class === "function") {
          let startDate, endDate;
          if (Array.isArray(options.data[j].children)) {
            let taskData = [...options.data[j].children];
            let dateData = this.getStartAndEndDate(taskData);
            startDate = dateData.startDate;
            endDate = dateData.endDate;
          }
          let cssClass = this.templates.task_row_class(
            startDate,
            endDate,
            options.data[j]
          );
          if (cssClass) {
            cssClass = cssClass.trim().replace(/\s+/g, " ").split(" ");
            scaleRow.classList.add(...cssClass);
          }
        }

        scaleRow.setAttribute("zt-gantt-data-task-id", j);
        scaleRow.style.height = options.row_height + "px";
        let cellEndDate = new Date(0);
        let rangeCount = 0;
        for (let k = 0; k < dates.length; k++) {
          let date = new Date(dates[k]);
          if (new Date(cellEndDate).getTime() >= date.setHours(0, 0, 0, 0)) {
            continue;
          }
          let colDates;
          let scaleCell = document.createElement("div");
          scaleCell.classList.add("zt-gantt-task-cell");
          if (this.options.zoomLevel !== "day") {
            colDates = this.initColSizes(this.options.zoomLevel, 1, date);
          } else {
            scaleCell.classList.add(
              options.weekends.includes(weekday[date.getDay()])
                ? "zt-gantt-weekend-cell"
                : "zt-gantt-weekday-cell",
              k == 0 ? "border-left-none" : "zt-gantt-task-cell"
            );
          }

          //add custom classes from user
          if (typeof this.templates.timeline_cell_class === "function") {
            let cssClass = this.templates.timeline_cell_class(
              options.data[j],
              dates[k]
            );
            if (cssClass) {
              cssClass = cssClass.trim().replace(/\s+/g, " ").split(" ");
              scaleCell.classList.add(...cssClass);
            }
          }

          if (this.options.zoomLevel !== "day") {
            if (this.options.zoomLevel === "hour") {
              scaleCell.style.left = rangeCount + "px";
              scaleCell.style.width = this.calculateGridWidth(date) + "px";
            } else {
              scaleCell.style.left = rangeCount + "px";
              scaleCell.style.width =
                colDates.dateCount.length * this.calculateGridWidth(date) +
                "px";
            }
          } else {
            scaleCell.style.left = this.calculateGridWidth(date) * k + "px";
            scaleCell.style.width = this.calculateGridWidth(date) + "px";
          }

          scaleCell.setAttribute(
            "zt-gantt-cell-date",
            this.formatDateToString(
              this.options.zoomLevel === "day"
                ? "%Y-%m-%d"
                : this.options.zoomLevel === "week"
                ? "W-%W"
                : this.options.zoomLevel === "month"
                ? "M-%m"
                : this.options.zoomLevel === "quarter"
                ? "Q-%q"
                : "%Y",
              date
            )
          );

          scaleCell.setAttribute("zt-gantt-task-id", options.data[j].id);
          let currentDate = new Date(date).setHours(0);
          if (this.options.zoomLevel === "hour") {
            let cellWidth = this.calculateGridWidth(date);
            for (let i = 0; i < 24; i++) {
              let hourCell = scaleCell.cloneNode(true);
              hourCell.style.left = rangeCount + "px";
              hourCell.style.width = cellWidth + "px";
              rangeCount += cellWidth;
              scaleRow.append(hourCell);
            }
          } else if (
            this.options.zoomLevel !== "day" &&
            new Date(cellEndDate).getTime() < currentDate
          ) {
            rangeCount +=
              colDates.dateCount.length * this.calculateGridWidth(date);
            cellEndDate = new Date(colDates.endDate);
            scaleRow.append(scaleCell);
          } else if (this.options.zoomLevel === "day") {
            scaleRow.append(scaleCell);
          }

          // handle cell click event
          let that = this;
          this.addClickListener(scaleCell, function (e) {
            const onCellClick = new CustomEvent("onCellClick", {
              detail: {
                task: options.data[j],
                cellDate: that.formatDateToString(
                  that.options.zoomLevel === "day"
                    ? "%Y-%m-%d"
                    : that.options.zoomLevel === "week"
                    ? "W-%W"
                    : that.options.zoomLevel === "month"
                    ? "M-%m"
                    : that.options.zoomLevel === "quarter"
                    ? "Q-%q"
                    : "%Y",
                  date
                ),
              },
            });
            that.element.dispatchEvent(onCellClick);
          });
        }

        let isTaskExist = this.getTask(options.data[j].id, this.searchedData);
        if (!this.searchedData || isTaskExist) {
          ztGanttTaskData.append(scaleRow);
        }

        // if children exist
        if (
          options.data[j].children &&
          this.options.data[j].children.length > 0
        ) {
          this.createBodyChildTask(
            options.data[j].children,
            options,
            j,
            dates,
            weekday,
            ztGanttTaskData,
            j,
            this.options.openedTasks.includes(this.options.data[j].id)
          );
        }
      }

      rightDataContainer.style.width =
        this.calculateTimeLineWidth("updated", "day") + "px";
      rightDataContainer.append(ztGanttTaskData);
      calendar.append(rightDataContainer);

      let isCalendarExist = document.querySelector("#zt-gantt-right-cell");

      if (isCalendarExist && isFromRender === false) {
        isCalendarExist.replaceWith(calendar);
      } else {
        mainContainer.append(calendar);
      }

      this.createTaskBars(rightDataContainer, isFromRender);

      // create custom scroller
      if (!isFromRender) {
        this.createScrollbar(
          mainContainer,
          options,
          this.verScroll || 0,
          this.horScroll || 0
        );

        // add all markers
        let isMarkerAreaExist = document.querySelector(".zt-gantt-marker-area");
        if (isMarkerAreaExist) {
          isMarkerAreaExist.remove();
        }
        for (let marker of this.options.customMarker) {
          this.addMarkerToGantt(marker);
        }

        // add today marker
        if (options.todayMarker) {
          this.addTodayFlag();
        }
      }

      if (this.options.addTaskOnDrag === true) {
        this.addTaskOnDrag(rightDataContainer);
      }
    },

    // create taskBars
    createTaskBars: function (barContainer = null, isFromRender = false) {
      let rowCount = 0;

      let ztGanttBarsArea = document.createElement("div");
      ztGanttBarsArea.classList.add("zt-gantt-bars-area");
      ztGanttBarsArea.id = "zt-gantt-bars-area";
      for (let j = 0; j < this.options.data.length; j++) {
        let start_date = new Date(this.options.data[j].start_date);
        let end_date = new Date(this.options.data[j].end_date);

        if (
          this.options.data[j].children &&
          this.options.data[j].children.length > 0
        ) {
          let taskData = [...this.options.data[j].children];
          let startAndEndDate = this.getStartAndEndDate(taskData);
          start_date = startAndEndDate.startDate;
          end_date = startAndEndDate.endDate;
        }

        let cellStartDate = this.options.startDate;
        let isCellGreater = true;
        let cellBefore = this.getDates(
          cellStartDate,
          this.options.data[j].type === "milestone"
            ? this.options.data[j].start_date
            : start_date
        );

        if (cellBefore.length === 0) {
          cellBefore = this.getDates(start_date, cellStartDate);
          isCellGreater = false;
        }

        if (!this.options.fullWeek) {
          cellBefore = cellBefore.filter((date) => {
            return !this.options.weekends.includes(
              this.options.dateFormat.day_short[new Date(date).getDay()]
            );
          });
        }

        if (isCellGreater) {
          cellBefore = cellBefore.length - 1;
        } else {
          cellBefore = -(cellBefore.length - 1);
        }

        let ztGanttBarTask = document.createElement("div");

        if (
          this.options.data[j].taskColor &&
          this.options.data[j].type !== "milestone"
        ) {
          ztGanttBarTask.style.setProperty(
            "background-color",
            this.changeOpacity(
              this.options.data[j].taskColor,
              this.options.taskOpacity
            ),
            "important"
          );
          ztGanttBarTask.style.setProperty(
            "border-color",
            this.options.data[j].taskColor,
            "important"
          );
        }

        if (this.options.data[j].type === "milestone") {
          ztGanttBarTask.classList.add(
            "zt-gantt-bar-task",
            "zt-gantt-bar-milestone",
            this.options.selectedTask === `${this.options.data[j].id}`
              ? "zt-gantt-selected-task-bar"
              : "zt-gantt-bar-milestone"
          );
        } else {
          ztGanttBarTask.classList.add(
            "zt-gantt-bar-task",
            "zt-gantt-bar-parent-task",
            this.options.selectedTask === `${this.options.data[j].id}`
              ? "zt-gantt-selected-task-bar"
              : "zt-gantt-bar-task"
          );
        }

        //add custom class from user
        if (typeof this.templates.task_class === "function") {
          let cssClass = this.templates.task_class(
            start_date,
            end_date,
            this.options.data[j]
          );
          if (cssClass) {
            cssClass = cssClass.trim().replace(/\s+/g, " ").split(" ");
            ztGanttBarTask.classList.add(...cssClass);
          }
        }

        ztGanttBarTask.setAttribute("task-parent", j);
        ztGanttBarTask.setAttribute("data-task-pos", 0);
        ztGanttBarTask.setAttribute(
          "zt-gantt-taskbar-id",
          this.options.data[j].id
        );

        let taskLeft = cellBefore * this.calculateGridWidth(start_date, "day");

        let hourLeft = this.getPxByTime(start_date, "left");
        taskLeft += hourLeft;

        ztGanttBarTask.style.left = taskLeft + "px";

        ztGanttBarTask.style.top =
          rowCount * this.options.row_height +
          Math.floor((this.options.row_height * 10) / 100) +
          "px";
        let barTaskHeight = Math.floor((this.options.row_height * 80) / 100);
        ztGanttBarTask.style.height = `${barTaskHeight}px`;
        ztGanttBarTask.style.lineHeight = `${barTaskHeight}px`;
        if (this.options.data[j].type === "milestone") {
          ztGanttBarTask.style.width = `${barTaskHeight}px`;
          ztGanttBarTask.style.left =
            (cellBefore + 1) * this.calculateGridWidth(start_date, "day") +
            "px";
        }

        let ztGanttBarTaskContent = document.createElement("div");
        ztGanttBarTaskContent.classList.add(
          "zt-gantt-bar-task-content",
          "parent-task-bar-content"
        );

        if (
          this.options.data[j].type === "milestone" &&
          this.options.data[j].taskColor
        ) {
          ztGanttBarTaskContent.style.setProperty(
            "background-color",
            this.options.data[j].taskColor,
            "important"
          );
        }

        let that = this;

        // handle double click event
        ztGanttBarTask.addEventListener("dblclick", handleDblClick);

        function handleDblClick(e) {
          that.createLightbox(that.options.data[j]);
          const onTaskDblClick = new CustomEvent("onTaskDblClick", {
            detail: {
              task: that.options.data[j],
            },
          });
          that.element.dispatchEvent(onTaskDblClick);
        }

        // Handle mouseover event
        ztGanttBarTask.addEventListener("mouseover", handleMouseOver);
        function handleMouseOver(e) {
          if (that.options.data[j].children) {
            let taskData = [...that.options.data[j].children];
            let startAndEndDate = that.getStartAndEndDate(taskData);
            start_date = startAndEndDate.startDate;
            end_date = startAndEndDate.endDate;
          }
          let tooltip = document.getElementById("zt-gantt-tooltip");
          tooltip.innerHTML = "";
          tooltip.innerHTML = that.templates.tooltip_text(
            that.options.data[j].type === "milestone"
              ? that.options.data[j].start_date
              : start_date,
            that.options.data[j].type === "milestone"
              ? that.options.data[j].end_date || that.options.data[j].start_date
              : end_date || start_date,
            that.options.data[j]
          );
          tooltip.style.display = "block";
        }

        // Handle mouseleave event
        ztGanttBarTask.addEventListener("mouseleave", handleMouseLeave);

        function handleMouseLeave(event) {
          let tooltip = document.getElementById("zt-gantt-tooltip");
          tooltip.innerHTML = "";
          tooltip.style.display = "none";
        }

        if (
          this.templates.task_drag("resize", this.options.data[j]) &&
          this.options.data[j].type !== "milestone"
        ) {
          // left side resizer
          let ztGanttTaskDragLeft = document.createElement("div");
          ztGanttTaskDragLeft.classList.add("zt-gantt-task-drag-left");

          // right side resizer
          let ztGanttTaskDragRight = document.createElement("div");
          ztGanttTaskDragRight.classList.add("zt-gantt-task-drag-right");

          ztGanttBarTask.append(ztGanttTaskDragLeft, ztGanttTaskDragRight);
          this.resizeTaskBars(
            ztGanttTaskDragLeft,
            ztGanttBarTask,
            "left",
            this.options.data[j]
          );
          this.resizeTaskBars(
            ztGanttTaskDragRight,
            ztGanttBarTask,
            "right",
            this.options.data[j]
          );
        }

        let taskDates = this.getDates(start_date, end_date);

        if (!this.options.fullWeek) {
          taskDates = taskDates.filter((date) => {
            return !this.options.weekends.includes(
              this.options.dateFormat.day_short[new Date(date).getDay()]
            );
          });
        }

        let taskProgress;
        if (
          this.options.taskProgress === true &&
          this.options.data[j].type !== "milestone"
        ) {
          let progressPer = this.options.data[j].progress || 0;
          let taskProgressContainer = document.createElement("div");
          taskProgressContainer.classList.add("zt-gantt-task-progress-wrapper");
          taskProgress = document.createElement("div");
          taskProgress.classList.add("zt-gantt-task-progress");
          taskProgress.style.width = `${
            progressPer > 100 ? 100 : progressPer
          }%`;

          if (this.options.data[j].taskColor) {
            taskProgress.style.setProperty(
              "background-color",
              this.options.data[j].taskColor,
              "important"
            );
          }

          taskProgressContainer.append(taskProgress);

          let taskProgressDrag = document.createElement("div");
          taskProgressDrag.classList.add("zt-gantt-task-progress-drag");
          taskProgressDrag.style.left = `${
            progressPer > 100 ? 100 : progressPer
          }%`;

          ztGanttBarTask.append(taskProgressContainer, taskProgressDrag);
          this.dragTaskProgress(
            taskProgressDrag,
            taskProgress,
            ztGanttBarTask,
            this.options.data[j]
          );
        }

        if (this.templates.task_drag("move", this.options.data[j])) {
          this.resizeTaskBars(
            ztGanttBarTaskContent,
            ztGanttBarTask,
            "move",
            this.options.data[j]
          );
        }

        // link control pointers
        if (this.options.addLinks === true) {
          // left point
          let leftLinkPoint = document.createElement("div");
          leftLinkPoint.classList.add(
            "zt-gantt-link-control",
            "zt-gantt-left-point"
          );
          let leftPoint = document.createElement("div");
          leftPoint.classList.add("zt-gantt-link-point");

          // right point
          let rightLinkPoint = document.createElement("div");
          rightLinkPoint.classList.add(
            "zt-gantt-link-control",
            "zt-gantt-right-point"
          );
          let rightPoint = document.createElement("div");
          rightPoint.classList.add("zt-gantt-link-point");

          leftLinkPoint.append(leftPoint);
          rightLinkPoint.append(rightPoint);
          ztGanttBarTask.append(leftLinkPoint, rightLinkPoint);

          this.createNewLink(
            rightPoint,
            ztGanttBarTask,
            this.options.data[j].id,
            "right"
          );
          this.createNewLink(
            leftPoint,
            ztGanttBarTask,
            this.options.data[j].id,
            "left"
          );
        }

        //add custom task color picker
        let isCustomColor =
          typeof this.options.taskColor === "function"
            ? this.options.taskColor(this.options.data[j])
            : this.options.taskColor;

        if (isCustomColor) {
          let colorPicker = document.createElement("div");
          colorPicker.classList.add("zt-gantt-task-color-picker");
          let colorInput = document.createElement("input");
          colorInput.id = `color-${this.options.data[j].id}`;
          colorInput.type = "color";
          colorInput.value =
            this.options.data[j].taskColor ||
            (this.options.data[j].type === "milestone" ? "#e84855" : "#56a4fd");
          colorPicker.append(colorInput);
          ztGanttBarTask.append(colorPicker);

          this.changeTaskbarColor(
            ztGanttBarTask,
            colorInput,
            taskProgress,
            ztGanttBarTaskContent,
            this.options.data[j]
          );
        }

        if (this.options.data[j].type !== "milestone") {
          let taskWidth =
            taskDates.length * this.calculateGridWidth(end_date, "day");

          let hourWidth = this.getPxByTime(end_date, "width");
          let hourLeft = this.getPxByTime(start_date, "left");
          hourWidth += hourLeft;
          taskWidth -= hourWidth;

          ztGanttBarTask.style.width = taskWidth + "px";
        }

        if (this.options.data[j].type === "milestone") {
          sideContent = document.createElement("div");
          sideContent.classList.add("zt-gantt-side-content");
          sideContent.innerHTML = this.templates.taskbar_text(
            new Date(start_date),
            new Date(end_date),
            this.options.data[j]
          );
          ztGanttBarTask.append(sideContent);
        } else {
          ztGanttBarTaskContent.innerHTML = this.templates.taskbar_text(
            start_date.setHours(0),
            end_date.setHours(0),
            this.options.data[j]
          );
        }
        ztGanttBarTask.append(ztGanttBarTaskContent);

        this.attachEvent("onAfterTaskUpdate", (event) => {
          if (this.options.data[j].type === "milestone") {
            sideContent.innerHTML = this.templates.taskbar_text(
              start_date.setHours(0),
              end_date.setHours(0),
              this.options.data[j]
            );
          } else {
            ztGanttBarTaskContent.innerHTML = this.templates.taskbar_text(
              start_date.setHours(0),
              end_date.setHours(0),
              this.options.data[j]
            );
          }
        });

        let isTaskExist = this.getTask(
          this.options.data[j].id,
          this.searchedData
        );
        if (!this.searchedData || isTaskExist) {
          ztGanttBarsArea.append(ztGanttBarTask);
        }

        if (!this.searchedData || isTaskExist) {
          rowCount += 1;
        }

        // if children exist
        if (
          this.options.data[j].children &&
          this.options.openedTasks.includes(this.options.data[j].id)
        ) {
          rowCount = this.createChildTaskBars(
            this.options.data[j].children,
            rowCount,
            cellStartDate,
            ztGanttBarsArea,
            j
          );
        }
      }

      const barsArea = document.getElementById("zt-gantt-bars-area");

      if (barContainer === null) {
        barContainer = document.getElementById("zt-gantt-scale-data");
      }

      // if barsArea exist then remove barsArea
      if (barsArea && !isFromRender) {
        barsArea.replaceWith(ztGanttBarsArea);
      } else {
        barContainer.append(ztGanttBarsArea);
      }
      if (!isFromRender) {
        // create links if addLinks is true
        if (this.options.addLinks === true) {
          let isLinksAreaExist = document.querySelector("#zt-gantt-links-area");
          // if lines already exist remove all lines
          if (isLinksAreaExist) {
            isLinksAreaExist.innerHTML = "";
          } else if (barContainer) {
            let linksArea = document.createElement("div");
            linksArea.classList.add("zt-gantt-links-area");
            linksArea.id = "zt-gantt-links-area";
            barContainer.append(linksArea);
          }

          for (let i = 0; i < this.options.links.length; i++) {
            this.createLinks(
              this.options.links[i].source,
              this.options.links[i].target,
              this.options.links[i]
            );
          }
        }
      }
    },

    // get week startDate and endDate
    getWeekStartEndDate: function (weekDate) {
      const date = new Date(weekDate);
      const start = new Date(
        date.setDate(
          date.getDate() - Math.abs(date.getDay() - this.options.weekStart)
        )
      );
      const end = new Date(
        date.setDate(
          date.getDate() - date.getDay() + (6 + this.options.weekStart)
        )
      );

      // Return the start and end dates
      return {
        start: start,
        end: end,
      };
    },

    // add click listner function
    addClickListener: function (element, callback) {
      element.addEventListener("click", callback);
    },

    // resize columns function
    resizeColumns: function (
      resizer,
      attr,
      headCell,
      headCellContainer,
      minWidth,
      maxWidth,
      columnIndex,
      sidebar,
      isRight
    ) {
      let colResizing = false,
        resizeArea,
        that = this,
        startX;

      resizer.removeEventListener("mousedown", handleMouseDown);
      resizer.addEventListener("mousedown", handleMouseDown);

      function handleMouseDown(event) {
        startX = event.x;
        resizeArea = document.createElement("div");
        resizeArea.classList.add("zt-gantt-grid-resize-area");
        resizeArea.id = "zt-gantt-resize-area";
        let resizeLeft = sidebar.offsetLeft + headCell.offsetLeft;

        resizeArea.style.left = resizeLeft + "px";

        const ztGanttLayout = document.getElementById("zt-gantt-layout");

        resizeArea.style.height = ztGanttLayout.scrollHeight + "px";

        let resizeAreaWidth = headCell.offsetWidth;

        resizeArea.style.width =
          (resizeAreaWidth < (minWidth || 80)
            ? minWidth || 80
            : resizeAreaWidth > maxWidth
            ? maxWidth
            : resizeAreaWidth) + "px";

        ztGanttLayout.append(resizeArea);
        document.addEventListener("mousemove", resize, false);
        document.addEventListener("mouseup", handleMouseUp, false);
      }

      function handleMouseUp(e) {
        document.removeEventListener("mousemove", resize, false);
        document.removeEventListener("mouseup", handleMouseUp, false);
        resizeArea.remove();
        if (colResizing) {
          let columns = document.querySelectorAll(`[${attr}]`);
          let colWidth = columns[0].offsetWidth + (e.x - startX);
          for (let col of columns) {
            col.style.width =
              (colWidth < (minWidth || 80)
                ? minWidth || 80
                : colWidth > maxWidth
                ? maxWidth
                : colWidth) + "px";
          }

          if (!isRight) {
            that.options.columns[columnIndex].width = colWidth;
          } else {
            that.options.rightGrid[columnIndex].width = colWidth;
          }

          let headerCell = document.getElementsByClassName(
            isRight ? "right-head-cell" : "head-cell"
          );
          const totalHeadWidth = Array.from(headerCell).reduce(
            (totalWidth, headCell) => totalWidth + headCell.offsetWidth,
            0
          );
          if (!isRight) {
            const sidebar = document.getElementById("zt-gantt-grid-left-data");
            sidebar.style.width = totalHeadWidth + 1 + "px";
            sidebar.style.minWidth = totalHeadWidth + 1 + "px";

            that.options.sidebarWidth = sidebar.offsetWidth;
          }
          // rerender the calendar and scale
          if (
            that.calculateTimeLineWidth("updated") !==
            that.calculateTimeLineWidth("current")
          ) {
            that.updateBody();
          } else {
            let mainContainer = document.querySelector(".zt-gantt-layout");
            that.createScrollbar(mainContainer, that.options);
          }

          let resizerLeft = 0;
          for (let j = 0; j < headerCell.length; j++) {
            resizerLeft += headerCell[j].offsetWidth;
            let resizerWrap;
            if (!isRight) {
              resizerWrap = document.getElementById(
                `zt-gantt-col-resizer-wrap-${j}`
              );
            } else {
              resizerWrap = document.getElementById(
                `zt-gantt-col-resizer-wrap-r-${j}`
              );
            }
            if (resizerWrap) {
              resizerWrap.style.left = resizerLeft + "px";
            }
          }

          if (!isRight) {
            headCellContainer.style.width = resizerLeft + "px";
            document.getElementById("zt-gantt-left-grid").style.width =
              resizerLeft + "px";
            document.getElementById(
              "zt-gantt-left-layout-resizer-wrap"
            ).style.left =
              document.getElementById("zt-gantt-grid-left-data").offsetWidth +
              "px";
          }
        }
        colResizing = false;
      }

      // resize the column
      function resize(e) {
        colResizing = true;
        let newWidth = headCell.offsetWidth + (e.x - startX);
        if (newWidth <= (minWidth || 80)) {
          resizeArea.style.width = (minWidth || 80) + "px";
          return;
        } else if (newWidth >= maxWidth) {
          resizeArea.style.width = maxWidth + "px";
          return;
        }

        document.getElementById("zt-gantt-resize-area").style.width =
          newWidth + "px";
      }
    },

    // resize sidebar function
    resizeSidebar: function (resizer, resizerLine, sidebar) {
      let sidebarResizing = false,
        that = this,
        startX,
        sidebarStartWidth;

      resizer.removeEventListener("mousedown", handleMouseDown);
      resizer.addEventListener("mousedown", handleMouseDown);

      function handleMouseDown(event) {
        startX = event.x;
        sidebarStartWidth = sidebar.offsetWidth;
        resizerLine.style.backgroundColor = "#218eed";

        // mouse move event
        document.addEventListener("mousemove", resize, false);
        // mouseup event
        document.addEventListener("mouseup", handleMouseUp, false);
      }

      function handleMouseUp(e) {
        document.removeEventListener("mousemove", resize, false);
        document.removeEventListener("mouseup", handleMouseUp, false);
        if (sidebarResizing) {
          // add the all columns minWidth
          const totalMinWidth = that.options.columns.reduce(
            (totalMinWidth, column) => totalMinWidth + column.min_width,
            0
          );

          let resizerLeft = 0,
            headerCell = document.getElementsByClassName("head-cell"),
            sidebarData = document.querySelector("#zt-gantt-left-grid");

          for (let j = 0; j < headerCell.length; j++) {
            let columns = document.querySelectorAll(
              `[data-column-index="${j}"]`
            );
            let incrasedWidth =
              headerCell[j].offsetWidth +
              Math.floor((e.x - startX) / that.options.columns.length);

            let resizerWrap = document.getElementById(
              `zt-gantt-col-resizer-wrap-${j}`
            );

            incrasedWidth =
              incrasedWidth > (that.options.columns[j].min_width || 80)
                ? incrasedWidth
                : that.options.columns[j].min_width || 80;

            // set the sidebar columns width
            for (let col of columns) {
              col.style.width = incrasedWidth + "px";
            }

            that.options.columns[j].width = incrasedWidth;

            // set the sidebar columns resizer left
            resizerLeft += headerCell[j].offsetWidth;
            if (resizerWrap) {
              resizerWrap.style.left = resizerLeft + "px";
            }
          }

          const totalHeadWidth = Array.from(headerCell).reduce(
            (totalWidth, headCell) => totalWidth + headCell.offsetWidth,
            0
          );

          // set the sidebar width
          let sidebarWidth = totalHeadWidth;

          sidebar.style.width =
            (sidebarWidth < totalMinWidth ? totalMinWidth : sidebarWidth) +
            "px";
          sidebar.style.minWidth =
            (sidebarWidth < totalMinWidth ? totalMinWidth : sidebarWidth) +
            "px";
          resizer.style.left =
            (sidebarWidth < totalMinWidth ? totalMinWidth : sidebarWidth) +
            "px";

          that.options.sidebarWidth = sidebar.offsetWidth;

          // set the sidebar header and body width
          sidebarData.style.width = sidebar.offsetWidth + "px";

          // rerender the calendar and scale

          if (
            that.calculateTimeLineWidth("updated") !==
            that.calculateTimeLineWidth("current")
          ) {
            that.updateBody();
          }

          if (
            that.calculateTimeLineWidth("updated") ===
            that.calculateTimeLineWidth("current")
          ) {
            let mainContainer = document.querySelector(".zt-gantt-layout");
            that.createScrollbar(mainContainer, that.options);
          }
        }
        resizerLine.style.backgroundColor = "#cecece";
        sidebarResizing = false;
      }

      // resize the sidebar
      function resize(e) {
        sidebarResizing = true;
        let size = `${sidebarStartWidth + (e.x - startX)}px`;
        resizer.style.left = size;
      }
    },

    // add today flag
    addTodayFlag: function () {
      let isTodayExist = document.getElementById("zt-gantt-marker-today");
      if (!isTodayExist) {
        let todayFlag = document.createElement("div");
        todayFlag.classList.add("zt-gantt-marker-today");
        todayFlag.id = "zt-gantt-marker-today";
        todayFlag.title = this.formatDateToString("%d %F %Y", new Date());
        let todayFlagText = document.createElement("div");
        todayFlagText.classList.add("zt-gantt-marker-today-text");
        todayFlagText.innerHTML = "Today";
        todayFlag.append(todayFlagText);
        let calendarContainer = document.getElementById("zt-gantt-scale-data");

        // Calculate the difference in days
        let daysDiff = this.getDates(
          new Date(this.options.startDate),
          new Date()
        );

        if (!this.options.fullWeek) {
          daysDiff = daysDiff.filter((date) => {
            return !this.options.weekends.includes(
              this.options.dateFormat.day_short[new Date(date).getDay()]
            );
          });
        }

        if (
          !this.options.fullWeek &&
          this.options.weekends.includes(
            this.options.dateFormat.day_short[new Date().getDay()]
          )
        ) {
          return;
        }

        daysDiff = daysDiff.length - 1 || 0;
        todayFlag.style.left =
          this.calculateGridWidth(new Date(), "day") * daysDiff + 15 + "px";

        if (calendarContainer) {
          calendarContainer.append(todayFlag);
        }
      }
    },

    // remove today flag
    removeTodayFlag: function () {
      let today = document.getElementById("zt-gantt-marker-today");
      if (today) {
        today.remove();
      }
    },

    // format date into given format
    formatDateToString: function (format, date) {
      let dateFormat = this.options.currentLanguage;
      date = new Date(date);
      let that = this;
      return format.replace(/%[a-zA-Z]/g, function (format) {
        switch (format) {
          case "%d":
            return toFixed(date.getDate());
          case "%m":
            return toFixed(date.getMonth() + 1);
          case "%q":
            return that.getQuarterOfDate(date);
          case "%j":
            return date.getDate();
          case "%n":
            return date.getMonth() + 1;
          case "%y":
            return toFixed(date.getFullYear() % 100);
          case "%Y":
            return date.getFullYear();
          case "%D":
            return dateFormat.day_short[date.getDay()];
          case "%l":
            return dateFormat.day_full[date.getDay()];
          case "%M":
            return dateFormat.month_short[date.getMonth()];
          case "%F":
            return dateFormat.month_full[date.getMonth()];
          case "%h":
            return toFixed(((date.getHours() + 11) % 12) + 1);
          case "%g":
            return ((date.getHours() + 11) % 12) + 1;
          case "%G":
            return date.getHours();
          case "%H":
            return toFixed(date.getHours());
          case "%i":
            return toFixed(date.getMinutes());
          case "%a":
            return date.getHours() > 11 ? "pm" : "am";
          case "%A":
            return date.getHours() > 11 ? "PM" : "AM";
          case "%s":
            return toFixed(date.getSeconds());
          case "%W":
            return toFixed(_getWeekNumber(date));
          default:
            return format;
        }
      });
      function toFixed(t) {
        return t < 10 ? "0" + t : t;
      }

      // get week number
      function _getWeekNumber(t) {
        if (!t) return !1;
        var n = t.getDay();
        0 === n && (n = 7);
        var i = new Date(t.valueOf());
        i.setDate(t.getDate() + (4 - n));
        var r = i.getFullYear(),
          a = Math.round((i.getTime() - new Date(r, 0, 1).getTime()) / 864e5);
        return 1 + Math.floor(a / 7);
      }
    },

    // add days in date
    add: function (t, e, n) {
      var i = new Date(t.valueOf());
      switch (n) {
        case "day":
          i = this._add_days(i, e, t);
          break;
        case "week":
          i = this._add_days(i, 7 * e, t);
          break;
        case "month":
          i.setMonth(i.getMonth() + e);
          break;
        case "year":
          i.setYear(i.getFullYear() + e);
          break;
        case "hour":
          i.setTime(i.getTime() + 60 * e * 60 * 1e3);
          break;
        case "minute":
          i.setTime(i.getTime() + 60 * e * 1e3);
          break;
        default:
          return this["add_" + n](t, e, n);
      }
      return i;
    },

    // add days in date
    _add_days: function (t, e, n) {
      t.setDate(t.getDate() + e);
      var i = e >= 0,
        r = !n.getHours() && t.getHours(),
        a =
          t.getDate() <= n.getDate() ||
          t.getMonth() < n.getMonth() ||
          t.getFullYear() < n.getFullYear();
      return (
        i && r && a && t.setTime(t.getTime() + 36e5 * (24 - t.getHours())), t
      );
    },

    // request browser fullscreen
    requestFullScreen: function () {
      const sidebar = document.getElementById("zt-gantt-grid-left-data");
      const resizer = document.getElementById(
        "zt-gantt-left-layout-resizer-wrap"
      );

      document.body.requestFullscreen?.() ||
        // For Firefox
        document.body.mozRequestFullScreen?.() ||
        // For Chrome and Safari
        document.body.webkitRequestFullscreen?.() ||
        // For Internet Explorer
        document.body.msRequestFullscreen?.();
      this.element.classList.add("zt-gantt-fullScreen");

      this.fullScreen = true;
      let isVerScrollExist = document.querySelectorAll(
        ".zt-gantt-ver-scroll-cell"
      );
      if (isVerScrollExist && isVerScrollExist.length > 0) {
        for (let scroll of isVerScrollExist) {
          scroll.remove();
        }
      }

      if (
        this.calculateTimeLineWidth("updated") !==
        this.calculateTimeLineWidth("current")
      ) {
        this.updateBody();
      } else {
        let mainContainer = document.querySelector(".zt-gantt-layout");
        let verScroll =
          document.querySelector(".zt-gantt-ver-scroll")?.scrollTop || 0;
        let horScroll =
          document.querySelector(".zt-gantt-hor-scroll")?.scrollLeft || 0;
        this.createScrollbar(mainContainer, this.options, verScroll, horScroll);
      }
      resizer.style.left = sidebar.offsetWidth + "px";

      // handle custom event
      const onExpand = new CustomEvent("onExpand", {
        detail: {
          type: "requestFullScreen",
        },
      });
      this.element.dispatchEvent(onExpand);
    },

    // exit browser fullscreen
    exitFullScreen: function (listener = false) {
      if (this.fullScreen !== true) {
        return;
      }
      this.element.classList.remove("zt-gantt-fullScreen");
      if (listener !== true) {
        document.body.exitFullscreen?.() ||
          // For Firefox
          document.body.mozCancelFullScreen?.() ||
          // For Chrome and Safari
          document.body.webkitExitFullscreen?.() ||
          // For Internet Explorer
          document.body.msExitFullscreen?.();
      }

      this.fullScreen = false;

      let isVerScrollExist = document.querySelectorAll(
        ".zt-gantt-ver-scroll-cell"
      );

      if (isVerScrollExist) {
        for (let scroll of isVerScrollExist) {
          scroll.remove();
        }
      }

      if (
        this.calculateTimeLineWidth("updated") !==
        this.calculateTimeLineWidth("current")
      ) {
        this.updateBody();
      } else {
        let mainContainer = document.querySelector(".zt-gantt-layout");
        this.createScrollbar(mainContainer, this.options);
      }

      // manage tooltip
      let tooltip = document.getElementById("zt-gantt-tooltip");
      tooltip.innerHTML = "";
      tooltip.style.display = "none";

      // handle custom event
      const onCollapse = new CustomEvent("onCollapse", {
        detail: {
          type: "exitFullScreen",
        },
      });
      this.element.dispatchEvent(onCollapse);
    },

    // expand all tree
    expandAll: function () {
      const childRows = document.querySelectorAll(".zt-gantt-child-row");
      const toggleIcons = document.querySelectorAll(".zt-gantt-tree-close");
      let openedTasks = [];

      for (let i = 0; i < this.options.data.length; i++) {
        openedTasks.push(this.options.data[i].id);
        if (this.options.data[i].children) {
          openedTasks = this.setAllExpand(
            this.options.data[i].children,
            openedTasks
          );
        }
      }

      for (let icon of toggleIcons) {
        icon.classList.remove("zt-gantt-tree-close");
        icon.classList.add("zt-gantt-tree-open");
      }

      for (let row of childRows) {
        if (row.classList.contains("d-none")) {
          row.classList.add("d-flex");
          row.classList.remove("d-none");
        }
      }

      this.options.openedTasks = [...new Set(openedTasks)];
      this.createTaskBars();
      let mainContainer = document.querySelector("#zt-gantt-layout");
      this.createScrollbar(mainContainer, this.options);
      this.options.collapse = false;
    },

    // collapse all tree
    collapseAll: function () {
      const childRows = document.querySelectorAll(".zt-gantt-child-row");
      const toggleIcons = document.querySelectorAll(".zt-gantt-tree-icon");

      // Make the opened task array empty
      this.options.openedTasks = [];

      // Change all the toggle icons to close
      for (let icon of toggleIcons) {
        icon.classList.remove("zt-gantt-tree-open");
        icon.classList.add("zt-gantt-tree-close");
      }

      // Hide all the child rows
      for (let row of childRows) {
        row.classList.add("d-none");
        row.classList.remove("d-flex");
      }

      // Again create all taskBars
      this.createTaskBars();
      let mainContainer = document.querySelector("#zt-gantt-layout");
      this.createScrollbar(mainContainer, this.options);
      this.options.collapse = true;
    },

    // get start and end dates from children array
    getStartAndEndDate: function (data) {
      function getDates(array) {
        let dates = [];
        array.forEach((item) => {
          if (Array.isArray(item.children) && item.children.length > 0) {
            dates = dates.concat(getDates(item.children));
          }
          if (
            item.hasOwnProperty("start_date") &&
            item.hasOwnProperty("end_date")
          ) {
            dates.push(new Date(item.start_date));
            dates.push(new Date(item.end_date || item.start_date));
          }
        });
        return dates;
      }

      // get lowest and highest dates
      const dateValues = getDates(data);
      const lowestDate = new Date(Math.min(...dateValues));
      const highestDate = new Date(Math.max(...dateValues));

      return { startDate: lowestDate, endDate: highestDate };
    },

    // resize or move Task Bars
    resizeTaskBars: function (resizer, taskBar, type, task) {
      let startX,
        startY,
        startWidth,
        startLeft,
        startTop,
        that = this,
        rightPanelScroll,
        rightPanelScrollWidth,
        resizeTask = false,
        startRightPanelScrollLeft,
        startRightPanelScrollTop,
        autoScroll = false,
        originalTask,
        initStartDate,
        initEndDate,
        scrollSpeed = 5,
        willRender = false;

      resizer.removeEventListener("mousedown", handleMouseDown);
      resizer.addEventListener("mousedown", handleMouseDown);

      function handleMouseDown(event) {
        rightPanelScroll = document.getElementById("zt-gantt-right-cell");
        rightPanelScrollWidth = rightPanelScroll.scrollWidth;
        initStartDate = task.start_date;
        initEndDate = task.end_date;
        startRightPanelScrollLeft = rightPanelScroll.scrollLeft;
        startRightPanelScrollTop = rightPanelScroll.scrollTop;
        startX = event.x;
        startY = event.y;
        startWidth = taskBar.offsetWidth;
        startLeft = taskBar.offsetLeft;
        startTop = taskBar.offsetTop;
        originalTask = { ...task };

        document.addEventListener("mousemove", resize, false);
        document.addEventListener("mouseup", handleMouseUp, false);
      }

      function handleMouseUp(e) {
        autoScroll = false;
        taskBar.classList.remove("task-dragging");
        document.removeEventListener("mousemove", resize, false);
        document.removeEventListener("mouseup", handleMouseUp, false);

        if (resizeTask === true) {
          let parentTask;
          let top = taskBar.offsetTop;
          let taskId = Math.floor(top / that.options.row_height);
          let allTaskbars = document.querySelectorAll(".zt-gantt-bar-task");
          let taskParentId = allTaskbars[taskId]?.getAttribute("task-parent");
          let taskPosition =
            +allTaskbars[taskId]?.getAttribute("data-task-pos");
          let taskPositionId = allTaskbars[taskId]?.getAttribute(
            "zt-gantt-taskbar-id"
          );
          let currentTaskParentId = taskBar.getAttribute("task-parent");
          let currentTaskPosition = +taskBar.getAttribute("data-task-pos");

          const updateData = (parentId, task, taskPositionId) => {
            let currentIndex = that.originalData.findIndex(
              (obj) => obj.id == task.id
            );
            let newIndexTask = that.getTask(taskPositionId);
            let newIndex = that.originalData.findIndex(
              (obj) => obj.id == taskPositionId
            );

            that.originalData.splice(currentIndex, 1); // Remove the object from the current position
            task.parent =
              parentId.length > 1 ? newIndexTask.parent : newIndexTask.id;
            that.originalData.splice(newIndex, 0, task); // Insert the object at the new position
          };
          if (taskId > -1 && taskId < allTaskbars.length) {
            let task = that.getTask(taskPositionId);
            parentId = taskParentId.length > 1 ? task.parent : task.id;
            parentTask = that.getTask(parentId);

            // handle custom event
            const onBeforeTaskDrop = new CustomEvent("onBeforeTaskDrop", {
              detail: {
                task: task,
                mode: type === "move" ? "move" : "resize",
                parentTask: parentTask,
              },
            });
            that.element.dispatchEvent(onBeforeTaskDrop);
          }

          if (type === "move" && that.eventValue === false) {
            taskBar.style.top = startTop + "px";
            taskBar.style.left = startLeft + "px";
            resizer.style.cursor = "pointer";
            that.updateTask(task, initStartDate, initEndDate, taskBar);
            resizeTask = false;
            that.eventValue = true;
          } else {
            if (type === "move") {
              resizer.style.cursor = "pointer";

              // if current task position or task parent is not same
              // update the task position in array
              if (
                (taskParentId !== currentTaskParentId ||
                  taskPosition !== currentTaskPosition) &&
                taskId > -1 &&
                taskId < allTaskbars.length &&
                taskParentId !==
                  currentTaskParentId.slice(0, currentTaskParentId.length - 1)
              ) {
                updateData(taskParentId, task, taskPositionId);
                willRender = true;
              } else {
                taskBar.style.top = startTop + "px";
              }
            }

            // set the left and width to whole column
            taskBar.style.left =
              Math.round(
                taskBar.offsetLeft /
                  that.calculateGridWidth(
                    task.start_date,
                    that.options.zoomLevel !== "hour" ? "day" : ""
                  )
              ) *
                that.calculateGridWidth(
                  task.start_date,
                  that.options.zoomLevel !== "hour" ? "day" : ""
                ) +
              "px";
            if (type !== "move") {
              taskBar.style.width =
                Math.round(
                  taskBar.offsetWidth /
                    that.calculateGridWidth(
                      task.start_date,
                      that.options.zoomLevel !== "hour" ? "day" : ""
                    )
                ) *
                  that.calculateGridWidth(
                    task.start_date,
                    that.options.zoomLevel !== "hour" ? "day" : ""
                  ) +
                "px";
            }
          }

          that.updateTask(
            task,
            task.start_date,
            task.end_date,
            taskBar,
            "mouseup"
          );

          if(willRender){
            // render the chart again
            that.render();
            willRender = false;
          }

          // handle custom event
          const onAfterTaskDrag = new CustomEvent("onAfterTaskDrag", {
            detail: {
              task: task,
              mode: type === "move" ? "move" : "resize",
              parentTask: that.getTask(task.parent),
            },
          });
          that.element.dispatchEvent(onAfterTaskDrag);
        }
        resizeTask = false;
      }

      // resize the taskBar
      function resize(e) {
        if (resizeTask === false) {
          // custom event handler
          const onBeforeTaskDrag = new CustomEvent("onBeforeTaskDrag", {
            detail: {
              task: task,
              mode: type === "move" ? "move" : "resize",
            },
          });
          that.element.dispatchEvent(onBeforeTaskDrag);
        }

        resizeTask = true;

        // if onBeforeTaskDrag return false then do not drag the task
        if (that.eventValue === false) {
          return;
        }

        function startAutoScroll(type) {
          if (type === "right") {
            rightPanelScroll.scrollLeft += scrollSpeed;
            if (
              rightPanelScroll.scrollLeft >=
              rightPanelScroll.scrollWidth - rightPanelScroll.clientWidth
            ) {
              autoScroll = false;
              return;
            }
          } else if (type === "left") {
            rightPanelScroll.scrollLeft -= scrollSpeed;
            if (rightPanelScroll.scrollLeft <= 0) {
              autoScroll = false;
              return;
            }
          } else if (type === "top") {
            rightPanelScroll.scrollTop += scrollSpeed;
            if (rightPanelScroll.scrollTop <= 0) {
              autoScroll = false;
              return;
            }
          } else if (type === "bottom") {
            rightPanelScroll.scrollTop -= scrollSpeed;
            if (
              rightPanelScroll.scrollTop >=
              rightPanelScroll.scrollHeight - rightPanelScroll.clientHeight
            ) {
              autoScroll = false;
              return;
            }
          }
          if (autoScroll) {
            setTimeout(() => {
              startAutoScroll(type);
            }, 50); // Adjust the scroll delay by changing the value here
          }
        }

        const scrollContainer =
          that.element.offsetLeft + rightPanelScroll.offsetLeft;
        const scrollThresholdRight =
          scrollContainer + rightPanelScroll.offsetWidth - 30;
        const scrollThresholdLeft = scrollContainer + 30;

        // auto scroll the div left and right
        if (e.clientX > scrollThresholdRight - window.scrollX) {
          autoScroll = true;
          startAutoScroll("right");
        } else if (e.clientX < scrollThresholdLeft - window.scrollX) {
          autoScroll = true;
          startAutoScroll("left");
        } else {
          autoScroll = false;
        }

        const scrollContainerTop =
          that.element.offsetTop + rightPanelScroll.offsetHeight;
        const scrollThresholdTop = scrollContainerTop - 30;
        const scrollThresholdBottom =
          that.element.offsetTop +
          that.calculateScaleHeight(
            that.options.scales,
            that.options.scale_height,
            "scroll",
            0
          ) +
          30;

        // auto scroll the div top and bottom
        if (e.clientY > scrollThresholdTop - window.scrollY) {
          autoScroll = true;
          startAutoScroll("top");
        } else if (e.clientY < scrollThresholdBottom - window.scrollY) {
          autoScroll = true;
          startAutoScroll("bottom");
        }

        // move the taskbar
        if (type === "move") {
          resizer.style.cursor = "move";
          let left =
            startLeft +
            (e.x - startX) -
            (startRightPanelScrollLeft - rightPanelScroll.scrollLeft);

          taskBar.style.left = left + "px";
          taskBar.style.top =
            startTop +
            (e.y - startY) -
            (startRightPanelScrollTop - rightPanelScroll.scrollTop) +
            "px";
          taskBar.classList.add("task-dragging");

          let taskStartDate =
            that.dates[
              Math.round(
                taskBar.offsetLeft /
                  that.calculateGridWidth(task.start_date, "day")
              ) - (task.type === "milestone" ? 1 : 0)
            ];

          let taskEndDate =
            that.dates[
              Math.round(
                (taskBar.offsetLeft + taskBar.offsetWidth) /
                  that.calculateGridWidth(task.start_date, "day")
              ) - 1
            ];

          // if taskStartDate is less than the gantt range
          if (!taskStartDate) {
            let dateDiff = Math.round(
              taskBar.offsetLeft /
                that.calculateGridWidth(task.start_date, "day")
            );
            taskStartDate = that.add(new Date(that.dates[0]), dateDiff, "day");
          }

          // if taskEndDate is greater than the gantt range
          if (!taskEndDate) {
            let dateDiff =
              Math.round(
                (taskBar.offsetLeft + taskBar.offsetWidth) /
                  that.calculateGridWidth(task.start_date)
              ) - that.dates.length;
            taskEndDate = that.add(
              new Date(that.dates[that.dates.length - 1]),
              dateDiff,
              "day"
            );
          }

          // emmit event of moveTask
          const onTaskDrag = new CustomEvent("onTaskDrag", {
            detail: {
              originalTask: originalTask,
              task: task,
              mode: "move",
            },
          });
          that.element.dispatchEvent(onTaskDrag);

          that.updateTask(
            task,
            new Date(taskStartDate),
            new Date(taskEndDate),
            taskBar
          );
          return;
        }

        let size, left;
        // drag taskbar left right
        if (type === "left") {
          size =
            startWidth -
            (e.x - startX) +
            (startRightPanelScrollLeft - rightPanelScroll.scrollLeft);
          left =
            startLeft +
            (e.x - startX) -
            (startRightPanelScrollLeft - rightPanelScroll.scrollLeft);
          if (
            size <= that.calculateGridWidth(task.start_date, "day") ||
            left <= 0
          ) {
            return;
          } else {
            taskBar.style.left = left + "px";
            taskBar.style.width = size + "px";
          }
        } else {
          size =
            startWidth +
            (e.x - startX) -
            (startRightPanelScrollLeft - rightPanelScroll.scrollLeft);
          // return if taskBar at start, end or width is 1 or less
          if (
            size <= that.calculateGridWidth(task.start_date, "day") ||
            taskBar.offsetLeft + size >= rightPanelScrollWidth
          ) {
            return;
          } else {
            taskBar.style.width = size + "px";
          }
        }

        let taskStartDate =
          that.dates[
            Math.round(
              (taskBar.offsetLeft + 1) /
                that.calculateGridWidth(task.start_date, "day")
            )
          ];

        let taskEndDate =
          that.dates[
            Math.round(
              (taskBar.offsetLeft + taskBar.offsetWidth) /
                that.calculateGridWidth(task.start_date, "day")
            ) - 1
          ];

        // emmit the dragTask event
        const onTaskDrag = new CustomEvent("onTaskDrag", {
          detail: {
            originalTask: originalTask,
            task: task,
            mode: "resize",
          },
        });
        that.element.dispatchEvent(onTaskDrag);

        // if taskStartDate is less than the gantt range
        if (!taskStartDate) {
          let dateDiff =
            Math.round(
              taskBar.offsetLeft /
                that.calculateGridWidth(task.start_date, "day")
            ) - that.dates.length;
          taskStartDate = that.add(
            new Date(that.dates[that.dates.length - 1]),
            dateDiff,
            "day"
          );
        }
        // if taskEndDate is greater than the gantt range
        if (!taskEndDate) {
          let dateDiff =
            Math.round(
              (taskBar.offsetLeft + taskBar.offsetWidth) /
                that.calculateGridWidth(task.start_date, "day")
            ) - that.dates.length;
          taskEndDate = that.add(
            new Date(that.dates[that.dates.length - 1]),
            dateDiff,
            "day"
          );
        }

        that.updateTask(
          task,
          new Date(taskStartDate),
          new Date(taskEndDate),
          taskBar
        );
      }
    },

    updateTask: function (task, start, end, target, eventType = "mousemove") {
      start = new Date(start);
      end = new Date(end);
      // get the current start and end date of the taskbar
      let taskCurrentStart = new Date(
        this.dates[
          Math.floor(target.offsetLeft / this.calculateGridWidth(start, "day"))
        ]
      );
      let taskCurrentEnd = new Date(
        this.dates[
          Math.floor(
            (target.offsetLeft + target.offsetWidth - 1) /
              this.calculateGridWidth(start, "day")
          )
        ]
      );
      let startTimePixel = Math.round(
        target.offsetLeft % this.calculateGridWidth(start, "day")
      );
      let startDateTime = this.getTimeByPx(startTimePixel, start);
      taskCurrentStart = new Date(taskCurrentStart);
      taskCurrentStart.setHours(startDateTime.hours, startDateTime.minutes);

      let endTimePixel = Math.round(
        (target.offsetLeft + target.offsetWidth - 1) %
          this.calculateGridWidth(start, "day")
      );
      let endDateTime = this.getTimeByPx(endTimePixel, end);
      taskCurrentEnd = new Date(taskCurrentEnd);
      taskCurrentEnd.setHours(endDateTime.hours, endDateTime.minutes);

      // update the task content innerHTML
      if (task.type === "milestone") {
        target.querySelector(".zt-gantt-side-content").innerHTML =
          this.templates.taskbar_text(taskCurrentStart, taskCurrentEnd, task);
      } else {
        target.querySelector(".zt-gantt-bar-task-content").innerHTML =
          this.templates.taskbar_text(taskCurrentStart, taskCurrentEnd, task);
      }

      // update the data in originalData
      for (let i = 0; i < this.originalData.length; i++) {
        if (this.originalData[i].id == task.id) {
          this.originalData[i].start_date = start;
          this.originalData[i].end_date = end;
          break;
        }
      }

      if (this.options.zoomLevel === "hour") {
        let taskLeft = Math.floor(
          (target.offsetLeft + 1) /
            this.calculateGridWidth(task.start_date, "day")
        );

        start = this.dates[taskLeft];
        let extraStartPX =
          target.offsetLeft +
          1 -
          taskLeft * this.calculateGridWidth(task.start_date, "day");
          let taskStartTime = this.getTimeByPx(extraStartPX,new Date(start));
        start = new Date(new Date(start).setHours(taskStartTime.hours));

        let taskLeftAndWidth =
          Math.floor(
            (target.offsetLeft + target.offsetWidth) /
              this.calculateGridWidth(task.end_date, "day")
          );
        end = this.dates[taskLeftAndWidth];
        let extraEndPX = target.offsetLeft +
          target.offsetWidth +
          1 -
          taskLeftAndWidth * this.calculateGridWidth(task.end, "day");
       
        let taskEndTime = this.getTimeByPx(extraEndPX,new Date(end));
        end = new Date(new Date(end).setHours(taskEndTime.hours-1));
      }
      this.updateTaskDate(task, start, end);
      this.updateTaskDuration();
      let start_date;
      let end_date;
      let hasProperty = false;
      if (target.classList.contains("zt-gantt-bar-parent-task")) {
        return;
      }
      let that = this;
      let allParents = target.getAttribute("task-parent").split("");
      let taskData = [...this.options.data];

      updateAllParents(taskData, allParents, eventType);

      function updateAllParents(data, allParents, eventType) {
        let currentTask;
        let currentLevel = data;
        let currentParentSelector = allParents[0];
        for (let i = 0; i < allParents.length - 1; i++) {
          if (
            currentLevel[allParents[i]].hasOwnProperty("start_date") &&
            currentLevel[allParents[i]].hasOwnProperty("end_date")
          ) {
            hasProperty = true;
            start_date = currentLevel[allParents[i]].start_date;
            end_date =
              currentLevel[allParents[i]].end_date ||
              currentLevel[allParents[i]].start_date;
          } else {
            hasProperty = false;
          }

          currentTask = currentLevel[allParents[i]];
          currentLevel = currentLevel[allParents[i]].children;
          let currentParent = document.querySelector(
            `[task-parent="${currentParentSelector}"]`
          );

          currentParentSelector = `${currentParentSelector}${
            allParents[i + 1]
          }`;

          if (currentLevel) {
            let cellStartDate = that.options.startDate;
            let isCellGreater = true;
            let cellBefore = that.getDates(cellStartDate, new Date(start_date));
            let taskDates = that.getDates(start_date, new Date(end_date));

            if (cellBefore.length === 0) {
              cellBefore = that.getDates(start_date, cellStartDate);
              isCellGreater = false;
            }

            if (!that.options.fullWeek) {
              cellBefore = cellBefore.filter((date) => {
                return !that.options.weekends.includes(
                  that.options.dateFormat.day_short[new Date(date).getDay()]
                );
              });
              taskDates = taskDates.filter((date) => {
                return !that.options.weekends.includes(
                  that.options.dateFormat.day_short[new Date(date).getDay()]
                );
              });
            }

            if (isCellGreater) {
              cellBefore = cellBefore.length - 1;
            } else {
              cellBefore = -(cellBefore.length - 1);
            }

            if (currentParent) {
              // update parent inner html
              if (currentTask.type === "milestone") {
                currentParent.querySelector(
                  ".zt-gantt-side-content"
                ).innerHTML = that.templates.taskbar_text(
                  start_date,
                  end_date,
                  currentTask
                );
              } else {
                currentParent.querySelector(
                  ".zt-gantt-bar-task-content"
                ).innerHTML = that.templates.taskbar_text(
                  start_date,
                  end_date,
                  currentTask
                );

                // find All childs of current parent
                let allChildsLeft = [];
                let allChildsLeftAndWidth = [];
                that.eachTask((task) => {
                  if (task.parent == currentTask.id) {
                    let childTaskBar = document.querySelector(
                      `[zt-gantt-taskbar-id="${task.id}"]`
                    );
                    if (childTaskBar) {
                      allChildsLeft.push(
                        childTaskBar.offsetLeft -
                          (task.type === "milestone" ? 9 : 0)
                      );
                      allChildsLeftAndWidth.push(
                        childTaskBar.offsetLeft -
                          (task.type === "milestone" ? 9 : 0) +
                          childTaskBar.offsetWidth
                      );
                    }
                  }
                });

                if (
                  currentTask.hasOwnProperty("start_date") &&
                  currentTask.hasOwnProperty("end_date")
                ) {
                  allChildsLeft.push(
                    cellBefore * that.calculateGridWidth(start_date, "day")
                  );
                  allChildsLeftAndWidth.push(
                    cellBefore * that.calculateGridWidth(start_date, "day") +
                      taskDates.length *
                        that.calculateGridWidth(start_date, "day")
                  );
                }

                let parentLeft = Math.min(...allChildsLeft);
                let parentWidth =
                  Math.max(...allChildsLeftAndWidth) -
                  Math.min(...allChildsLeft);

                if (eventType === "mouseup") {
                  const gridWidth = that.calculateGridWidth(
                    task.start_date,
                    that.options.zoomLevel !== "hour" ? "day" : ""
                  );
                  parentLeft = Math.round(parentLeft / gridWidth) * gridWidth;
                  parentWidth = Math.round(parentWidth / gridWidth) * gridWidth;
                }

                currentParent.style.left = `${parentLeft}px`;
                currentParent.style.width = `${parentWidth}px`;
              }
            }
          }
        }
      }
    },

    updateTaskDate: function (task, start, end) {
      task.start_date = start;
      task.end_date = end;
      this.originalData.findIndex((item) => {
        if (item.id == task.id) {
          item.start_date = start;
          item.end_date = end;
        }
      });
    },

    initColSizes: function (unit, step, date) {
      let startDate, endDate;
      let startAndEndDate;

      if (unit == "hour") {
        // if unit is day and step is greater than 1
        startAndEndDate = {
          start: new Date(date),
          end: new Date(date),
        };
      } else if (unit == "day") {
        // if unit is day and step is greater than 1
        startAndEndDate = {
          start: new Date(date),
          end: new Date(date),
        };
      } else if (unit == "week") {
        // if unit is week
        startAndEndDate = this.getWeekStartEndDate(date);
      } else if (unit == "month") {
        // if unit is month
        startAndEndDate = this.getMonthStartEndDate(date);
      } else if (unit == "quarter") {
        // if unit is quarter
        startAndEndDate = this.getQuarterStartEndDate(date);
      } else if (unit == "year") {
        // if unit is year
        let dateYear = new Date(date).getFullYear();
        startAndEndDate = {
          start: new Date(dateYear, 0, 1),
          end: new Date(dateYear, 11, 31),
        };
      } else {
        this.toastr("Error", `Invalid scale unit: ${unit}`, "error");
      }

      startDate = startAndEndDate.start;
      endDate = startAndEndDate.end;

      if (step > 1) {
        endDate = this.add(endDate, step - 1, unit);
      }

      const dateCount = this.getDates(startDate, endDate).filter((date) => {
        const rangeStart = new Date(this.options.startDate).setHours(
          0,
          0,
          0,
          0
        );
        const rangeEnd = new Date(this.options.endDate).setHours(0, 0, 0, 0);
        const dateToCheck = new Date(date).setHours(0, 0, 0, 0);
        return dateToCheck >= rangeStart && dateToCheck <= rangeEnd;
      });

      return {
        startDate: startDate,
        endDate: endDate,
        dateCount: dateCount,
      };
    },

    // get month start and end date of a date
    getMonthStartEndDate: function (date) {
      date = new Date(date); // date for which we find month start and month end
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Add 1 because getMonth() returns 0-indexed months
      const firstDayOfMonth = new Date(year, month - 1, 1);
      const lastDayOfMonth = new Date(year, month, 0);
      return {
        start: firstDayOfMonth,
        end: lastDayOfMonth,
      };
    },

    // get quarter start and end date of a date
    getQuarterStartEndDate: function (dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth();

      const quarterStartMonth = Math.floor(month / 3) * 3;
      const quarterStartDate = new Date(year, quarterStartMonth, 1);
      const quarterEndDate = new Date(year, quarterStartMonth + 3, 0);

      return {
        start: quarterStartDate,
        end: quarterEndDate,
      };
    },

    // calculate scale height
    calculateScaleHeight: function (scales, scaleHeight, type, i) {
      if (type === "header" || type === "scroll") {
        let height;
        if (Array.isArray(scaleHeight)) {
          height = scaleHeight.reduce((total, height) => total + height);
          if (scales.length !== scaleHeight.length) {
            height += (scales.length - scaleHeight.length) * 30;
          }
        } else {
          height = scales.length * scaleHeight;
        }
        return type === "scroll" ? height : `${height}px`;
      } else {
        if (Array.isArray(scaleHeight)) {
          return `${i > 0 ? scaleHeight[i] || 30 : scaleHeight[i] - 1 || 29}px`;
        } else {
          return `${i > 0 ? scaleHeight : scaleHeight - 1}px`;
        }
      }
    },

    calculateGridWidth: function (
      date = new Date(0),
      levelType = this.options.zoomLevel
    ) {
      let sidebar = document.getElementById("zt-gantt-grid-left-data");
      const totalWidth = this.options.columns.reduce(
        (totalWidth, col) => totalWidth + col.width,
        0
      );

      let sidebarWidth = 0;
      if (sidebar) {
        let headCell = document.querySelectorAll(".head-cell");
        if (headCell.length !== this.options.columns.length) {
          sidebarWidth = totalWidth;
        } else {
          sidebarWidth = sidebar.offsetWidth;
        }
      } else {
        sidebarWidth = totalWidth;
      }

      let elementWidth = this.element.scrollWidth - sidebarWidth;

      if (this.options.rightGrid) {
        const totalWidth = this.options.rightGrid.reduce(
          (totalWidth, col) => totalWidth + col.width,
          0
        );
        elementWidth -= totalWidth;
      }

      if (sidebar?.offsetHeight < sidebar?.scrollHeight) {
        elementWidth -= 20;
      }

      let minWidth = this.options.minColWidth;
      const colCount = this.dates.length;
      let level = date !== new Date(0) ? this.options.zoomLevel : "day";
      date = new Date(date);
      switch (level) {
        case "hour":
          minWidth = levelType === "day" ? minWidth : minWidth / 24;
          break;
        case "week":
          minWidth = minWidth / 7;
          break;
        case "month":
          minWidth = minWidth / this.getDaysInMonth(date);
          break;
        case "quarter":
          minWidth = minWidth / this.getDaysInQuarter(date);
          break;
        case "year":
          minWidth = minWidth / 365;
          break;
        default:
          minWidth = minWidth;
          break;
      }
      const gridWidth = Math.max(
        elementWidth /
          (level === "hour" && levelType !== "day" ? colCount * 24 : colCount),
        minWidth
      );
      return gridWidth;
    },

    calculateTimeLineWidth: function (
      type,
      levelType = this.options.zoomLevel
    ) {
      let totalWidth = 0;
      if (type == "updated") {
        if (this.options.zoomLevel !== "day" && levelType !== "day") {
          let colDates;
          let endDate = new Date(0);
          for (let i = 0; i < this.dates.length; i++) {
            colDates = this.initColSizes(
              this.options.zoomLevel,
              1,
              this.dates[i]
            );
            let cellWidth = this.calculateGridWidth(this.dates[i]);
            if (endDate.getTime() < this.dates[i]) {
              totalWidth += cellWidth * colDates.dateCount.length;
              endDate = colDates.endDate;
            }
          }
        } else {
          totalWidth =
            this.calculateGridWidth(new Date(0), levelType) * this.dates.length;
        }
      } else {
        let timeLineRow = document.querySelector(".zt-gantt-task-row");
        let timeLineCell = timeLineRow.querySelectorAll(".zt-gantt-task-cell");
        totalWidth = Array.from(timeLineCell).reduce(
          (totalWidth, cell) => totalWidth + cell.offsetWidth,
          0
        );
      }
      return totalWidth;
    },

    createLightbox: function (task) {
      const lightbox = document.getElementById("zt-gantt-lightbox");
      const lightboxBackdrop = document.getElementById(
        "zt-gantt-lightbox-backdrop"
      );
      if (lightbox) {
        lightbox.remove();
        lightboxBackdrop.remove();
      }
      let lightBoxContainer = document.createElement("div");
      let backdrop = document.createElement("div");
      lightBoxContainer.classList.add("zt-gantt-lightbox");
      lightBoxContainer.id = "zt-gantt-lightbox";
      backdrop.classList.add("zt-gantt-lightbox-backdrop");
      backdrop.id = "zt-gantt-lightbox-backdrop";
      lightBoxContainer.setAttribute("role", "dialog");
      lightBoxContainer.innerHTML =
        this.templates.showLightBox?.(task) ||
        `<div class="zt-gantt-task-title">
      <span>${task.text}</span>
    </div>
    <div><p>${this.options.currentLanguage.label.description}</p></div>
    <div>
    <textarea rows="4" id="lightbox-text-area" placeholder="Description">${task.text}</textarea>
    </div>
    <div class='lightbox-footer'>
    <button role="save">${this.options.currentLanguage.buttons.save}</button>
    <button role="cancel">${this.options.currentLanguage.buttons.cancel}</button>
    <button role="delete">${this.options.currentLanguage.buttons.delete}</button>
    </div>   
    `;
      document.body.append(backdrop);
      document.body.append(lightBoxContainer);
      let that = this;
      // hide lightbox
      let cancelbtn = document.querySelector("[role=cancel]");
      cancelbtn.addEventListener("click", handleCancelClick);
      function handleCancelClick() {
        that.hideLightbox();
      }

      // delete task
      let deletebtn = document.querySelector("[role=delete]");
      deletebtn.addEventListener("click", handleDeleteClick);
      function handleDeleteClick() {
        that.deleteTask(task.id);
      }

      // update task
      let savebtn = document.querySelector("[role=save]");
      savebtn.addEventListener("click", handleSaveClick);
      function handleSaveClick() {
        let value = document.querySelector("#lightbox-text-area").value;
        task.text = value;
        that.updateTaskData(task);
      }
    },

    // hide lightbox
    hideLightbox: function () {
      const lightbox = document.getElementById("zt-gantt-lightbox");
      const backdrop = document.getElementById("zt-gantt-lightbox-backdrop");
      if (lightbox) {
        lightbox.style.display = "none";
        backdrop.style.display = "none";
      }
    },

    // add Task
    addTask: function (task) {
      if (task.id == task.parent) {
        this.toastr(
          "Error",
          "task id and task parent can not be same",
          "error"
        );
      }

      this.originalData.unshift(task);
      this.eachTask((item) => {
        if (item.id == task.parent) {
          if (!item.children) {
            item.children = [];
          }

          item.children.unshift(task);
        }
      });

      // this.render();
      this.options.openedTasks.push(+task.parent);
      this.options.openedTasks.push(task.id);

      this.options.openedTasks = [...new Set(this.options.openedTasks)];
      this.hideLightbox();
    },

    // delete task
    deleteTask: function (id) {
      const task = this.getTask(id);
      for (let i = 0; i < this.originalData.length; i++) {
        if (this.originalData[i].id == id) {
          this.originalData.splice(i, 1);
          this.render();
          this.hideLightbox();
          const onTaskDelete = new CustomEvent("onTaskDelete", {
            detail: {
              task: task,
            },
          });
          this.element.dispatchEvent(onTaskDelete);
          break;
        }
      }
    },

    // update task data
    updateTaskData: function (task) {
      const updatedTaskIndex = this.originalData.findIndex(
        (item) => item.id === task.id
      );
      if (updatedTaskIndex !== -1) {
        this.originalData[updatedTaskIndex] = {
          ...this.originalData[updatedTaskIndex],
          ...task,
        };

        this.eachTask((item) => {
          if (item.id === task.id) {
            task = this.originalData[updatedTaskIndex];
          }
        });

        this.updateTaskDuration();
        this.hideLightbox();

        const onAfterTaskUpdate = new CustomEvent("onAfterTaskUpdate", {
          detail: {
            task: task,
          },
        });
        this.element.dispatchEvent(onAfterTaskUpdate);
      }
    },

    // export Gantt as PNG
    exportToPNG: function (name = "ztGantt") {
      const sidebar = document.querySelector("#zt-gantt-grid-left-data");
      const timeLine = document.querySelector("#zt-gantt-right-cell");
      let fullWidth = sidebar.scrollWidth + timeLine.scrollWidth;
      let fullHeight = sidebar.scrollHeight;

      if (this.options.rightGrid) {
        const rightSideBar = document.querySelector(
          "#zt-gantt-grid-right-data"
        );
        fullWidth += rightSideBar.scrollWidth;
      }

      const ztGantt = document.getElementById("zt-gantt-layout");

      this.showLoader();

      timeLine.style.minWidth = timeLine.scrollWidth + "px";
      timeLine.style.height = sidebar.scrollHeight + "px";
      sidebar.style.height = sidebar.scrollHeight + "px";
      let that = this;
      html2canvas(ztGantt, {
        scale: 0.8,
        width: fullWidth,
        height: fullHeight,
      }).then(function (canvas) {
        var dataURL = canvas.toDataURL("image/png");
        var link = document.createElement("a");
        link.download = `${name}.png`;
        link.href = dataURL;
        link.click();
        timeLine.style.minWidth = "";
        timeLine.style.height = "";
        sidebar.style.height = "";
        that.hideLoader();
      });
    },

    // export Gantt as PDF
    exportToPDF: function (name = "ztGantt") {
      const doc = new jspdf.jsPDF("p", "pt", "letter");
      const margin = 10;
      const element = document.querySelector("#zt-gantt-layout");
      const sidebar = document.querySelector("#zt-gantt-grid-left-data");
      const timeLine = document.querySelector("#zt-gantt-right-cell");
      const totalWidth = sidebar.scrollWidth + timeLine.scrollWidth;

      if (this.options.rightGrid) {
        const rightSideBar = document.querySelector(
          "#zt-gantt-grid-right-data"
        );
        totalWidth += rightSideBar.offsetWidth;
      }

      let scale = (doc.internal.pageSize.width - margin * 2) / totalWidth;

      timeLine.style.minWidth = timeLine.scrollWidth + "px";
      timeLine.style.height = sidebar.scrollHeight + "px";
      sidebar.style.height = element.scrollHeight + "px";

      // add File To VFS
      let font =
        "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AHMAOgAvAC8AcwBjAHIAaQBwAHQAcwAuAHMAaQBsAC4AbwByAGcALwBPAEYATABUAGgAaQBzACAARgBvAG4AdAAgAFMAbwBmAHQAdwBhAHIAZQAgAGkAcwAgAGwAaQBjAGUAbgBzAGUAZAAgAHUAbgBkAGUAcgAgAHQAaABlACAAUwBJAEwAIABPAHAAZQBuACAARgBvAG4AdAAgAEwAaQBjAGUAbgBzAGUALAAgAFYAZQByAHMAaQBvAG4AIAAxAC4AMQAuACAAVABoAGkAcwAgAGwAaQBjAGUAbgBzAGUAIABpAHMAIABhAHYAYQBpAGwAYQBiAGwAZQAgAHcAaQB0AGgAIABhACAARgBBAFEAIABhAHQAOgAgAGgAdAB0AHAAcwA6AC8ALwBzAGMAcgBpAHAAdABzAC4AcwBpAGwALgBvAHIAZwAvAE8ARgBMAGgAdAB0AHAAcwA6AC8ALwBpAG4AZABpAGEAbgB0AHkAcABlAGYAbwB1AG4AZAByAHkALgBjAG8AbQBOAGkAbgBhAGQAIABLAGEAbABlACAAKABEAGUAdgBhAG4AYQBnAGEAcgBpACkALAAgAEoAbwBuAG4AeQAgAFAAaQBuAGgAbwByAG4AIAAoAEwAYQB0AGkAbgApAEkAbgBkAGkAYQBuACAAVAB5AHAAZQAgAEYAbwB1AG4AZAByAHkAUABvAHAAcABpAG4AcwAtAFIAZQBnAHUAbABhAHIANAAuADAAMAA0AFAAbwBwAHAAaQBuAHMAIABSAGUAZwB1AGwAYQByAEkAVABGAE8AOwAgAFAAbwBwAHAAaQBuAHMAIABSAGUAZwB1AGwAYQByADsAIAA0AC4AMAAwADQAYgA4AFIAZQBnAHUAbABhAHIAUABvAHAAcABpAG4AcwBDAG8AcAB5AHIAaQBnAGgAdAAgADIAMAAyADAAIABUAGgAZQAgAFAAbwBwAHAAaQBuAHMAIABQAHIAbwBqAGUAYwB0ACAAQQB1AHQAaABvAHIAcwAgACgAaAB0AHQAcABzADoALwAvAGcAaQB0AGgAdQBiAC4AYwBvAG0ALwBpAHQAZgBvAHUAbgBkAHIAeQAvAFAAbwBwAHAAaQBuAHMAKQAAACYAJgAmACYAcgDDAQABTwGGAdICIAKEAuADUgODA8IEIgSPBJsEpwSzBMQE7QUTBTUFXAV7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Aor/5QKl/+UCPv/lAoH/5QNW/+UCt//lAv4ATwJh/+UCyABRAzb/5QKP/+UD2f/lArD/5QMbAEwDEv/lAuH/5QOI/+UCov/lAyYALQKV/+UDbf/lAkr/5QPm/+UEEv/lA6X/5QLp/+UDSP/lBBb/5QLi/+UCov/lAeD/5QGm/+UClP/lAcf/5QMx/+UCIv/lAjn/5QIf/+UCiv/lAqX/5QI+/+UCgf/lAjT/5QGq/+UB2ABPAmH/5QGsAFEB/v/lAW7/5QLh/+UBnv/lAf4ATAH5/+UBvf/lA4j/5QGK/+UB8gAtAYP/5QIM/+UCSv/lA+b/5QMR/+UCov/lAeD/5QIi/+UDHv/lBtj/5QbY/+UGjf/lBV3/5QY3/+UFff/lBjT/5QRG/+UFkv/lB0f/5QWy/+UHCf/lBef/5QVW/+UGEf/lBVb/5QVW/+UGtP/lBrT/5Qa1/+UFpv/lBhP/5QYN/+UFz//lBnz/5QWY/+UHdv/lBhD/5QUjAEgG8ABIBOIASASjAEgGHP/lB4X/5QdJ/+UHr//lB4X/5Qnt/+UGRv/lBVT/5QVU/+UFyv/lBdD/5QXQ/+UFi//lBYv/5QVK/+UFSv/lBcH/5QXB/+UF1v/lBKv/5QR5/+UE///lBRf/5QQd/+UEfv/lBlr/5QYl/+UE2P/lBqX/5QRt/+UE0P/lBo3/5QTb/+UEnv/lBJ7/5QVD/+UEXv/lBOb/5QTD/+UEzP/lBKX/5QRs/+UE/P/lBPz/5QTp/+UE6v/lBMD/5QVV/+UFVf/lBgr/5QWB/+UFgf/lBTn/5QdJ/+UHAP/lBXT/5QUd/+UEr//lBEr/5QTf/+UEiv/lBT3/5QTS/+UFQf/lBRH/5QUR/+UEx//lBT3/5QVP/+UFCv/lBOz/5QVT/+UFbP/lBUf/5QKr/+UCr//lBPL/5QKS/+UCm//lBPz/5QKX/+UCTf/lAln/8ASW/+UCWv/lAqD/5QT1/+UCgf/lBJ7/5QTJ/+UEXP/lBKv/5QV+/+UFKf/lBOv/5QTE/+UFZv/lB1P/5QVm/+UHG//lBL3/5QU9/+UFPf/lAt3/5QSB/9YET//lBIT/5QSK/+UGWP/lA/r/5QP6/+UGYv/lBUX/5QSa/+UGZv/lBGn/5QSS/+UFBP/lBCn/5QTQ/+UGwv/lBoj/5QY//+UFEwBPBNoATwSaAE8CgP/lAoD/5QOG/+UCI//cA4b/5QVi/+UCYP/lAmD/5QVa/+UDMv/lAr3/+AJb/+UE4ABRBrcAUQTuAFEEpwBRBE4AUQXc/+UIFf/lBKT/5QU1/+UEev/lBCf/5QSu/+UGYv/lBIb/5QbI/+UE8v/lBs7/5QaN/+UEUf/lBFH/5QRE/+UEuf/lBpT/5QS5/+UGMf/lBRf/5Qbk/+UEe//lBHv/5QXG/+UFxv/lBPv/5QbW/+UGn//lBSz/5Qb5/+UE4//lBJT/5QUz/+UGnP/lCPj/5Qbs/+UEN//lBAb/5QQg/+UEH//lBdT/5QSI/+UEC//lBVb/5QRx/+UEXf/lBPf/5QQV/+UEm//lBiv/5QYr/+UFg//lBaz/5QWs/+UGCP/lBWL/5Qas/+UGrP/lBcf/5QZo/+UGB//lBhP/5QTp/+UE8f/lBrL/5QUc/+UEYv/lBBX/5QRi/+UGD//lBM//5QRk/+UEw//lBNn/5QSI/+UFMv/lByz/5QRW/+UEzv/lBNn/5QUeAEwE2QBMBNkATAWJAEwEogBMBJz/5QRW/+UFCf/lBIj/5QSI/+UEqv/lBoz/5QSp/+UFCP/lBsX/5QUd/+UGjv/lBRP/5QTe/+UFfv/lBJ3/5QUi/+UFLP/lBDD/5QTb/+UErv/lA6H/5QL8/+UGi//lCHf/5QY+/+UFk//lBdz/5QXc/+UFMv/lBUb/5QTH/+UFHP/lBVf/5QWW/+UHcf/lBQP/5QUD/+UFF//lBmP/5QVY/+UFuv/lBc7/5QWC/+UGI//lCCr/5QVK/+UHJf/lBcf/5QSz/+UEvv/lBIH/5QUq/+UERP/lA7H/5QXwAFoF8ABaAx0ALQVkAFoEowBaBMsAWgT2AC0FLQBaBPUAWgWaAFoDHQAtBTgAWgVo/+UFaP/lBAv/5QZz/+UEC//lBAT/5QQl/+UGff/lBCX/5QS+/+UGUv/lA/b/5QP2/+UFQf/lBJT/5QZg/+UEXP/lBBv/5QP9/+UF7v/lBe7/5Qej/+UFpP/lBVr/5QSb/+UEx//lBnr/5QSm/+UGOv/lBP//5Qbb/+UEbf/lBSX/5QSd/+UEnf/lBfz/5QS7/+UFK//lBvn/5QTs/+UFjf/lBKP/5QUz/+UCnv/lBOP/5QTk/+UDd//lArr/5QKI/+UF5v/lASb97QAA/0YAAABCAAD/xgAA/8YCRP/cASb/QwEm/0MBJv9DASb97QEm/e0BJv3tAAD+MgAA/jIAAP4yAAD+LAAA/iwAAP4sASb/WAEm/1gBJv9YASb/TwEm/08BJv9PAAD+ogEm/8cDPf/lAvH/5QJK/+UCSv/lAkr/5QMmAC0CnP/lASb/5QEm/+UBJv/lASb/5QEm/+UBJv/lASb/5QEm/+UBJv/lASb/5QEm/+UBJv/lASb/5QEm/+UBJv/lASb/5QEm/+UBJv/lASb/5QEm/+UBJv/lASb/5QEm/+UBJv/lASoAWAEkACMDSAAhAm4APAL3ACoC4wAlAJ8AIwHGAGwBxgAhAeYAPQKrAFcAxv/+AicAOgDSACwB3AA1AnQAPgFAACYCPwAzAk0AMQJ1ACgCdABJAnsASQIiACECdwA8AnYASQDVACwBCAAXAisAVALTAGUCGwBeAgwAJQP1AEgCogAhAmUATQMEACsCwwBNAgEATQH4AE0DCgArArQATQD2AE0CEgApAlcATQGwAE0DXQBNAr8ATQMSACsCQwBNAxQAKwJgAE0CSwA5Ah0AIgKjAEsCpAAWA9AAFwJtAC0CSAATAh0ALgGnAIUCkgCDAacAbgJ1ACUC3QBpAQEAEQKkACsCpABNAl8AKwKkACsCbAArAUkAFwKkACsCgABNAPYAPgD4/+UCAwBNAPYATQQGAE0CgABNAoAAKwKkAE0CpAArAXUATQIKAC8BbAAaAoAASAIxAAwDNAAMAd8ADQIzAAwBxwApAc4AaQEjAGQBzgBEAgcAJQELAAABKgBYApkAQQJsACwCGQA/AlMAGQEjAGQCPwAuAToAFwMYADEBwgAhAc0ALQKKACkCJwA6Af0ANAGDABEBmgAcAq4AWAFKAB4BTAAXAPcAEQKFAE0CVAAfANQALwEQABEAxAAZAbQAIQHNADICgAAmAqMAJALFACMCBwAuAqIAIQKiACECogAhAqIAIQKiACECogAhA4QADAMEACsCAQBNAgEATQIBAE0CAQBNAPYABwD2AAcA9v/wAPb/9QLVAAkCvwBNAxIAKwMSACsDEgArAxIAKwMSACsCgwBnAxIAIwKjAEsCowBLAqMASwKjAEsCSAATAkMATQKpADwCpAArAqQAKwKkACsCpAArAqQAKwKkACsESQArAl8AKwJsACsCbAArAmwAKwJsACsA9gAHAPYABwD2//AA9v/1An4AKwKAAE0CgAArAoAAKwKAACsCgAArAoAAKwKRAE4CgAAmAoAASAKAAEgCgABIAoAASAIzAAwCpABNAjMADAKiACECpAArAqIAIQKkACsCogAhAqQAKwMEACsCXwArAwQAKwJfACsDBAArAl8AKwLDAE0C8gArAtUACQKjACsCAQBNAmwAKwIBAE0CbAArAgEATQJsACsCAQBNAmwAKwIBAE0CbAArAwoAKwKkACsDCgArAqQAKwMKACsCpAArAPb/6AD2/+gA9v/KAPb/ygD2/+wA9v/sAPb/6gD2/+oA9gBGAPYATQJXAE0CAwBNAbAATQD2AAcBsABNAPYASwG+AE0BcQBNAbAATQEnAE0BtQAJAPsACQK/AE0CgABNAr8ATQKAAE0CvwBNAoAATQMSACsCgAArAxIAKwKAACsDEgArAoAAKwQ+ACsEOAArAmAATQF1AE0CYABNAXUASwJgAE0BdQBNAksAOQIKAC8CSwA5AgoALwJLADkCCgAvAh0AIgFsABoCHQAiAW8AGgKjAEsCgABIAqMASwKAAEgCowBLAoAASAKjAEsCgABIAqMASwKAAEgCowBLAoAASAPQABcDNAAMAkgAEwIzAAwCSAATAh0ALgHHACkCHQAuAccAKQIdAC4BxwApAxIARAFM/9ADhAAMBEwAKwJLADkCCgAvAh0AIgFsABoCbAArANsAIAE3ABEBNwARAYMAEQFAABEAjwATAPMADwDxABQBWQARAVgAEQLGACcD0AAXAzQADAPQABcDNAAMA9AAFwM0AAwCAQBNAmwAKwJIABMCMwAMAkgAEwIzAAwCpQBMA3UATADbABgA2wAgALr//gF8ABgBfAAgAV7//gIiACwCIwAtAZwAUwJFACwD7QApARgALQEYADIB7gAJAysAGQM+ABgCcAAkAPYATQMNABkDEwApAvkALwI8ACcCqAAUAuMAJwHJACgCJwBMAdwANQDUAC8DFAATArgAIQEF/9kCBwAlAsIAZQH/AEoB/wBLAioAJAI7ABgCPgAXAREAUgC7ACEAzQAwAO4APAC9ACECDAAlAREAUgDNADACDAAwApEATgCiAB0AogAeASkAHQEpAB4CRgAwAlYAKwJWACsCVgArAlYAKwJWACsCVgArAlcAKwJWACsCVgArAlYAKwKiACUCVAA5AlkANQJSADoAKgAA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AYcBiAGJAYoBiwGMAY0BjgGPAZABkQGSAZMBlAGVAZYBlwGYAZkBmgGbAZwBnQGeAZ8BoAGhAaIBowGkAaUBpgGnAagBqQGqAasBrAGtAa4BrwGwAbEBsgGzAbQBtQG2AbcBuAG5AboBuwG8Ab0BvgG/AcABwQHCAcMBxAHFAcYBxwHIAckBygHLAcwBzQHOAc8B0AHRAdIB0wHUAdUB1gHXAdgB2QHaAdsB3AHdAd4B3wHgAeEB4gHjAeQB5QHmAecB6AHpAeoB6wHsAe0B7gHvAfAB8QHyAfMB9AH1AfYB9wH4AfkB+gH7AfwB/QH+Af8CAAIBAgICAwIEAgUCBgIHAggCCQIKAgsCDAINAg4CDwIQAhECEgITAhQCFQIWAhcCGAIZAhoCGwIcAh0CHgIfAiACIQIiAiMCJAIlAiYCJwIoAikCKgIrAiwCLQIuAi8CMAIxAjICMwI0AjUCNgI3AjgCOQI6AjsCPAI9Aj4CPwJAAkECQgJDAkQCRQJGAkcCSAJJAkoCSwJMAk0CTgJPAlACUQJSAlMCVAJVAlYCVwJYAlkCWgJbAlwCXQJeAl8CYAJhAmICYwJkAmUCZgJnAmgCaQJqAmsCbAJtAm4CbwJwAnECcgJzAnQCdQJ2AncCeAJ5AnoCewJ8An0CfgJ/AoACgQKCAoMChAKFAoYChwKIAokCigKLAowCjQKOAo8CkAKRApICkwKUApUClgKXApgCmQKaApsCnAKdAp4CnwKgAqECogKjAqQCpQKmAqcCqAKpAqoCqwKsAq0CrgKvArACsQKyArMCtAK1ArYCtwK4ArkCugK7ArwCvQK+Ar8CwALBAsICwwLEAsUCxgLHAsgCyQLKAssCzALNAs4CzwLQAtEC0gLTAtQC1QLWAtcC2ALZAtoC2wLcAt0C3gLfAuAC4QLiAuMC5ALlAuYC5wLoAukC6gLrAuwC7QLuAu8C8ALxAvIC8wL0AvUC9gL3AvgC+QL6AvsC/AL9Av4C/wMAAwEDAgMDAwQDBQMGAwcDCAMJAwoDCwMMAw0DDgMPAxADEQMSAxMDFAMVAxYDFwMYAxkDGgMbAxwDHQMeAx8DIAMhAyIDIwMkAyUDJgMnAygDKQMqAysDLAMtAy4DLwMwAzEDMgMzAzQDNQM2AzcDOAM5AzoDOwM8Az0DPgM/A0ADQQNCA0MDRANFA0YDRwNIA0kDSgNLA0wDTQNOA08DUANRA1IDUwNUA1UDVgNXA1gDWQNaA1sDXANdA14DXwNgA2EDYgNjA2QDZQNmA2cDaANpA2oDawNsA20DbgNvA3ADcQNyA3MDdAN1A3YDdwN4A3kDegN7A3wDfQN+A38DgAOBA4IDgwOEA4UDhgOHA4gDiQOKA4sDjAONA44DjwOQA5EDkgOTAAQABQAGAAcACAAJAAoACwAMAA0ADgAPABAAEQASABMAFAAVABYAFwAYABkAGgAbABwAHQAeAB8AIAAhACIAIwAkACUAJgAnACgAKQAqACsALAAtAC4ALwAwADEAMgAzADQANQA2ADcAOAA5ADoAOwA8AD0APgA/AEAAQQBCAEMARABFAEYARwBIAEkASgBLAEwATQBOAE8AUABRAFIAUwBUAFUAVgBXAFgAWQBaAFsAXABdAF4AXwBgAGEDlACjAIQAhQC9AJYA6ACGAI4AiwCdAKkApAOVAIoA2gCDAJMA8gDzAI0DlgCIAMMA3gDxAJ4AqgD1APQA9gCiAK0AyQDHAK4AYgBjAJAAZADLAGUAyADKAM8AzADNAM4A6QBmANMA0ADRAK8AZwDwAJEA1gDUANUAaADrAO0AiQBqAGkAawBtAGwAbgCgAG8AcQBwAHIAcwB1AHQAdgB3AOoAeAB6AHkAewB9AHwAuAChAH8AfgCAAIEA7ADuALoDlwOYA5kDmgObA5wA/QD+A50DngD/AQADnwOgA6EBAQOiA6MDpAOlA6YDpwOoA6kDqgOrAPgA+QOsA60DrgOvA7ADsQOyA7MDtAO1A7YDtwD6ANcDuAO5A7oDuwO8A70DvgO/A8ADwQDiAOMDwgPDA8QDxQPGA8cDyAPJA8oDywPMA80AsACxA84DzwPQA9ED0gPTA9QD1QPWA9cA5ADlA9gD2QPaA9sD3APdA94D3wPgA+ED4gPjA+QD5QPmA+cD6APpA+oD6wC7A+wD7QPuA+8A5gDnA/AApgPxA/ID8wP0A/UD9gP3A/gA2ADhA/kA2wDcAN0A4ADZAN8AmwP6A/sD/AP9A/4D/wQABAEEAgQDBAQEBQCyALMAtgC3AMQAtAC1AMUAggDCAIcAqwDGAL4AvwC8BAYEBwQIBAkAjAQKBAsAmAQMAJoAmQDvBA0EDgClAJIAnACnAI8AlACVALkAwADBBA8EEAQRBBIEEwQUBBUEFgQXBBgEGQQaBBsEHAQdBB4EHwQgBCEEIgQjBCQEJQQmBCcEKAQpBCoEKwQsBE5VTEwCQ1IDZHZBBGR2QUEDZHZJBGR2SUkDZHZVBGR2VVUEZHZ2UgVkdnZSUgRkdnZMBWR2dkxMA2R2RQRkdkFJA2R2TwRkdkFVCWR2RWNhbmRyYQlkdkFjYW5kcmEJZHZPY2FuZHJhBWR2bUFBBGR2bUkFZHZtSUkEZHZtVQVkdm1VVQVkdm12UgZkdm12UlIFZHZtdkwGZHZtdkxMBGR2bUUFZHZtQUkEZHZtTwVkdm1BVQpkdm1FY2FuZHJhCmR2bU9jYW5kcmEEZHZLQQVkdktIQQRkdkdBBWR2R0hBBWR2TkdBBGR2Q0EFZHZDSEEEZHZKQQVkdkpIQQVkdk5ZQQVkdlRUQQZkdlRUSEEFZHZEREEGZHZEREhBBWR2Tk5BBGR2VEEFZHZUSEEEZHZEQQVkdkRIQQRkdk5BBGR2UEEFZHZQSEEEZHZCQQVkdkJIQQRkdk1BBGR2WUEEZHZSQQRkdkxBBGR2VkEFZHZTSEEFZHZTU0EEZHZTQQRkdkhBBWR2TExBB2R2S19TU0EHZHZKX05ZQQVkdkt4QQZkdktIeEEFZHZHeEEFZHZKeEEGZHZERHhBB2R2RERIeEEGZHZQSHhBBWR2UnhBA2R2SwRkdktIA2R2RwRkdkdIBGR2TkcDZHZDBGR2Q0gDZHZKBGR2SkgEZHZOWQRkdlRUBWR2VFRIBGR2REQFZHZEREgEZHZOTgNkdlQEZHZUSANkdkQEZHZESANkdk4DZHZQBGR2UEgDZHZCBGR2QkgDZHZNA2R2WQNkdlIDZHZMA2R2VgRkdlNIBGR2U1MDZHZTA2R2SARkdkxMBmR2S19TUwZkdkpfTlkEZHZLeAVkdktIeARkdkd4BGR2SngFZHZQSHgKZHZBbnVzdmFyYQ1kdkNhbmRyYWJpbmR1CWR2VmlzYXJnYQpkdkF2YWdyYWhhCGR2VmlyYW1hB2R2TnVrdGEGZHZaZXJvBWR2T25lBWR2VHdvB2R2VGhyZWUGZHZGb3VyBmR2Rml2ZQVkdlNpeAdkdlNldmVuB2R2RWlnaHQGZHZOaW5lBGR2T20SZHZBYmJyZXZpYXRpb25zaWduBWRhbmRhC2RvdWJsZWRhbmRhBXJ1cGVlC2luZGlhbnJ1cGVlEnplcm93aWR0aG5vbmpvaW5lcg96ZXJvd2lkdGhqb2luZXIMZG90dGVkY2lyY2xlBmR2UmVwaAlkdkV5ZWxhc2gNZHZSYXNodHJhc2lnbgZkdktfUkEHZHZLSF9SQQZkdkdfUkEHZHZHSF9SQQdkdk5HX1JBBmR2Q19SQQdkdkNIX1JBBmR2Sl9SQQdkdkpIX1JBB2R2TllfUkEHZHZUVF9SQQhkdlRUSF9SQQdkdkREX1JBCGR2RERIX1JBB2R2Tk5fUkEGZHZUX1JBB2R2VEhfUkEGZHZEX1JBB2R2REhfUkEGZHZOX1JBBmR2UF9SQQdkdlBIX1JBBmR2Ql9SQQdkdkJIX1JBBmR2TV9SQQZkdllfUkEGZHZMX1JBBmR2Vl9SQQdkdlNIX1JBB2R2U1NfUkEGZHZTX1JBBmR2SF9SQQdkdkxMX1JBB2R2S3hfUkEIZHZLSHhfUkEHZHZHeF9SQQdkdkp4X1JBCGR2UEh4X1JBBWR2S19SBmR2S0hfUgVkdkdfUgZkdkdIX1IGZHZOR19SBWR2Q19SBmR2Q0hfUgVkdkpfUgZkdkpIX1IGZHZOWV9SBmR2VFRfUgdkdlRUSF9SBmR2RERfUgdkdkRESF9SBmR2Tk5fUgVkdlRfUgZkdlRIX1IFZHZEX1IGZHZESF9SBWR2Tl9SBWR2UF9SBmR2UEhfUgVkdkJfUgZkdkJIX1IFZHZNX1IFZHZZX1IFZHZMX1IFZHZWX1IGZHZTSF9SBmR2U1NfUgVkdlNfUgVkdkhfUgZkdkxMX1IGZHZLeF9SB2R2S0h4X1IGZHZHeF9SBmR2SnhfUgdkdlBIeF9SBmR2S19LQQhkdkt4X0t4QQdkdktfS0hBBmR2S19DQQZkdktfSkEHZHZLX1RUQQdkdktfTk5BBmR2S19UQQdkdkt4X1RBCGR2S19UX1lBCGR2S19UX1JBCGR2S19UX1ZBB2R2S19USEEGZHZLX0RBBmR2S19OQQZkdktfUEEIZHZLX1BfUkEHZHZLX1BIQQhkdkt4X1BIQQlkdkt4X1BIeEEHZHZLeF9CQQZkdktfTUEHZHZLeF9NQQZkdktfWUEGZHZLX0xBBmR2S19WQQhkdktfVl9ZQQdkdktfU0hBCWR2S19TU19NQQtkdktfU1NfTV9ZQQlkdktfU1NfWUEJZHZLX1NTX1ZBBmR2S19TQQlkdktfU19UVEEJZHZLX1NfRERBCGR2S19TX1RBCmR2S19TX1BfUkEKZHZLX1NfUF9MQQhkdktIX0tIQQdkdktIX1RBCGR2S0h4X1RBB2R2S0hfTkEHZHZLSF9NQQhkdktIeF9NQQdkdktIX1lBCGR2S0h4X1lBB2R2S0hfVkEIZHZLSHhfVkEIZHZLSF9TSEEJZHZLSHhfU0hBCGR2S0h4X1NBBmR2R19HQQdkdkdfR0hBBmR2R19KQQdkdkdfTk5BBmR2R19EQQdkdkdfREhBCWR2R19ESF9ZQQlkdkdfREhfVkEGZHZHX05BCGR2R19OX1lBBmR2R19CQQdkdkdfQkhBCWR2R19CSF9ZQQZkdkdfTUEGZHZHX1lBCGR2R19SX1lBBmR2R19MQQZkdkdfVkEGZHZHX1NBB2R2R0hfTkEHZHZHSF9NQQdkdkdIX1lBBmR2Q19DQQdkdkNfQ0hBCWR2Q19DSF9WQQZkdkNfTkEGZHZDX01BBmR2Q19ZQQdkdkNIX1lBCWR2Q0hfUl9ZQQZkdkpfS0EGZHZKX0pBCGR2SnhfSnhBCWR2Sl9KX05ZQQhkdkpfSl9ZQQhkdkpfSl9WQQdkdkpfSkhBCWR2Sl9OWV9ZQQdkdkpfVFRBB2R2Sl9EREEGZHZKX1RBBmR2Sl9EQQZkdkpfTkEGZHZKX0JBBmR2Sl9NQQZkdkpfWUEHZHZKeF9ZQQZkdkpfVkEHZHZKSF9OQQdkdkpIX01BB2R2SkhfWUEHZHZOWV9DQQhkdk5ZX0NIQQdkdk5ZX0pBCGR2TllfU0hBCGR2VFRfVFRBCWR2VFRfVFRIQQdkdlRUX1lBB2R2VFRfVkEKZHZUVEhfVFRIQQhkdlRUSF9ZQQhkdlRUSF9WQQhkdkREX0REQQlkdkREX0RESEEHZHZERF9ZQQdkdkREX1ZBCmR2RERIX0RESEEIZHZEREhfWUEIZHZEREhfVkEIZHZOTl9UVEEJZHZOTl9UVEhBCGR2Tk5fRERBCWR2Tk5fRERIQQhkdk5OX05OQQdkdk5OX01BB2R2Tk5fWUEHZHZOTl9WQQZkdlRfS0EIZHZUX0tfWUEIZHZUX0tfUkEIZHZUX0tfVkEJZHZUX0tfU1NBB2R2VF9LSEEJZHZUX0tIX1JBBmR2VF9UQQhkdlRfVF9ZQQhkdlRfVF9WQQdkdlRfVEhBBmR2VF9OQQhkdlRfTl9ZQQZkdlRfUEEIZHZUX1BfUkEIZHZUX1BfTEEHZHZUX1BIQQZkdlRfTUEIZHZUX01fWUEGZHZUX1lBCGR2VF9SX1lBBmR2VF9MQQZkdlRfVkEGZHZUX1NBCGR2VF9TX05BCGR2VF9TX1lBCGR2VF9TX1ZBB2R2VEhfTkEHZHZUSF9ZQQdkdlRIX1ZBBmR2RF9HQQhkdkRfR19SQQdkdkRfR0hBBmR2RF9EQQdkdkRfREhBBmR2RF9OQQZkdkRfQkEIZHZEX0JfUkEHZHZEX0JIQQZkdkRfTUEGZHZEX1lBBmR2RF9WQQdkdkRIX05BCWR2REhfTl9ZQQdkdkRIX01BB2R2REhfWUEHZHZESF9WQQZkdk5fS0EIZHZOX0tfU0EGZHZOX0NBB2R2Tl9DSEEHZHZOX1RUQQdkdk5fRERBBmR2Tl9UQQhkdk5fVF9ZQQhkdk5fVF9SQQhkdk5fVF9TQQdkdk5fVEhBCWR2Tl9USF9ZQQlkdk5fVEhfVkEGZHZOX0RBCGR2Tl9EX1JBCGR2Tl9EX1ZBB2R2Tl9ESEEJZHZOX0RIX1lBCWR2Tl9ESF9SQQlkdk5fREhfVkEGZHZOX05BCGR2Tl9OX1lBBmR2Tl9QQQhkdk5fUF9SQQdkdk5fUEhBCWR2Tl9QSF9SQQdkdk5fQkhBCWR2Tl9CSF9ZQQlkdk5fQkhfVkEGZHZOX01BCGR2Tl9NX1lBBmR2Tl9ZQQZkdk5fVkEGZHZOX1NBCWR2Tl9TX1RUQQpkdk5fU19NX1lBCGR2Tl9TX1lBBmR2Tl9IQQdkdlBfVFRBCGR2UF9UVEhBBmR2UF9UQQhkdlBfVF9ZQQZkdlBfTkEGZHZQX1BBB2R2UF9QSEEGZHZQX01BBmR2UF9ZQQZkdlBfTEEGZHZQX1ZBBmR2UF9TQQdkdlBIX0pBCWR2UEh4X0p4QQhkdlBIX1RUQQdkdlBIX1RBCGR2UEh4X1RBB2R2UEhfTkEHZHZQSF9QQQhkdlBIX1BIQQpkdlBIeF9QSHhBB2R2UEhfWUEHZHZQSF9MQQhkdlBIX1NIQQhkdlBIeF9TQQZkdkJfSkEHZHZCX0p4QQhkdkJfSl9ZQQdkdkJfSkhBBmR2Ql9UQQZkdkJfREEHZHZCX0RIQQlkdkJfREhfVkEGZHZCX05BBmR2Ql9CQQdkdkJfQkhBCWR2Ql9CSF9SQQZkdkJfWUEGZHZCX0xBCGR2Ql9MX1lBBmR2Ql9WQQdkdkJfU0hBBmR2Ql9TQQdkdkJIX05BB2R2QkhfWUEJZHZCSF9SX1lBB2R2QkhfTEEHZHZCSF9WQQZkdk1fVEEGZHZNX0RBBmR2TV9OQQZkdk1fUEEIZHZNX1BfUkEGZHZNX0JBCGR2TV9CX1lBCGR2TV9CX1JBB2R2TV9CSEEJZHZNX0JIX1lBCWR2TV9CSF9SQQlkdk1fQkhfVkEGZHZNX01BBmR2TV9ZQQZkdk1fTEEGZHZNX1ZBB2R2TV9TSEEGZHZNX1NBBmR2TV9IQQZkdllfTkEGZHZZX1lBDGR2RXllbGFzaF9ZQQxkdkV5ZWxhc2hfSEEGZHZMX0tBCGR2TF9LX1lBB2R2TF9LSEEGZHZMX0dBBmR2TF9KQQdkdkxfSnhBB2R2TF9UVEEIZHZMX1RUSEEHZHZMX0REQQhkdkxfRERIQQZkdkxfVEEHZHZMX1RIQQlkdkxfVEhfWUEGZHZMX0RBCGR2TF9EX1JBBmR2TF9QQQdkdkxfUEhBBmR2TF9CQQdkdkxfQkhBBmR2TF9NQQZkdkxfWUEGZHZMX0xBCGR2TF9MX1lBBmR2TF9WQQlkdkxfVl9EREEGZHZMX1NBBmR2TF9IQQZkdlZfTkEGZHZWX1lBBmR2Vl9MQQZkdlZfVkEGZHZWX0hBB2R2U0hfS0EIZHZTSF9LeEEHZHZTSF9DQQhkdlNIX0NIQQhkdlNIX1RUQQdkdlNIX1RBB2R2U0hfTkEHZHZTSF9NQQdkdlNIX1lBB2R2U0hfTEEHZHZTSF9WQQhkdlNIX1NIQQdkdlNTX0tBCWR2U1NfS19SQQhkdlNTX1RUQQpkdlNTX1RUX1lBCmR2U1NfVFRfUkEKZHZTU19UVF9WQQlkdlNTX1RUSEELZHZTU19UVEhfWUELZHZTU19UVEhfUkEIZHZTU19OTkEKZHZTU19OTl9ZQQdkdlNTX1BBCWR2U1NfUF9SQQhkdlNTX1BIQQdkdlNTX01BCWR2U1NfTV9ZQQdkdlNTX1lBB2R2U1NfVkEIZHZTU19TU0EGZHZTX0tBCGR2U19LX1JBCGR2U19LX1ZBB2R2U19LSEEGZHZTX0pBB2R2U19UVEEGZHZTX1RBCGR2U19UX1lBCGR2U19UX1JBCGR2U19UX1ZBB2R2U19USEEJZHZTX1RIX1lBBmR2U19EQQZkdlNfTkEGZHZTX1BBCGR2U19QX1JBB2R2U19QSEEGZHZTX0JBBmR2U19NQQhkdlNfTV9ZQQZkdlNfWUEGZHZTX0xBBmR2U19WQQZkdlNfU0EHZHZIX05OQQZkdkhfTkEGZHZIX01BBmR2SF9ZQQZkdkhfTEEGZHZIX1ZBB2R2TExfWUELZHZtSUkuYUxvbmcPZHZSZXBoX0FudXN2YXJhDmR2QW51c3ZhcmEuYW1JCmR2UmVwaC5hbUkTZHZSZXBoX0FudXN2YXJhLmFtSQ1kdklJX0FudXN2YXJhDmR2bUlJX0FudXN2YXJhCmR2bUlJX1JlcGgTZHZtSUlfUmVwaF9BbnVzdmFyYRRkdm1JSV9BbnVzdmFyYS5hTG9uZxBkdm1JSV9SZXBoLmFMb25nGWR2bUlJX1JlcGhfQW51c3ZhcmEuYUxvbmcNZHZtRV9BbnVzdmFyYQlkdm1FX1JlcGgSZHZtRV9SZXBoX0FudXN2YXJhDmR2bUFJX0FudXN2YXJhCmR2bUFJX1JlcGgTZHZtQUlfUmVwaF9BbnVzdmFyYQ1kdm1PX0FudXN2YXJhCWR2bU9fUmVwaBJkdm1PX1JlcGhfQW51c3ZhcmEOZHZtQVVfQW51c3ZhcmEKZHZtQVVfUmVwaBNkdm1BVV9SZXBoX0FudXN2YXJhE2R2bUVjYW5kcmFfQW51c3ZhcmETZHZtT2NhbmRyYV9BbnVzdmFyYQdkdlJBX21VCGR2UkFfbVVVB2R2SEFfbVUIZHZIQV9tVVUIZHZEQV9tdlIJZHZTSEFfbXZSCGR2SEFfbXZSCGR2bUkuYTAxCGR2bUkuYTAyCGR2bUkuYTAzCGR2bUkuYTA0CGR2bUkuYTA1CGR2bUkuYTA2CGR2bUkuYTA3CGR2bUkuYTA4CGR2bUkuYTA5CGR2bUkuYTEwCGR2bUkuYTExCGR2bUkuYTEyCGR2bUkuYTEzCGR2bUkuYTE0CGR2bUkuYTE1CGR2bUkuYTE2CGR2bUkuYTE3CGR2bUkuYTE4CGR2bUkuYTE5CGR2bUkuYTIwCGR2bUkuYTIxCGR2bUkuYTIyCGR2bUkuYTIzCGR2bUkuYTI0B3VuaTAwQTAHdW5pMDBBRAd1bmkwMEI1B0FtYWNyb24HYW1hY3JvbgZBYnJldmUGYWJyZXZlB0FvZ29uZWsHYW9nb25lawpDZG90YWNjZW50CmNkb3RhY2NlbnQGRGNhcm9uBmRjYXJvbgZEY3JvYXQHRW1hY3JvbgdlbWFjcm9uBkVicmV2ZQZlYnJldmUKRWRvdGFjY2VudAplZG90YWNjZW50B0VvZ29uZWsHZW9nb25lawZFY2Fyb24GZWNhcm9uCkdkb3RhY2NlbnQKZ2RvdGFjY2VudAd1bmkwMTIyB3VuaTAxMjMGSXRpbGRlBml0aWxkZQdJbWFjcm9uB2ltYWNyb24HdW5pMDEyQwd1bmkwMTJEB0lvZ29uZWsHaW9nb25lawd1bmkwMTM2B3VuaTAxMzcGTGFjdXRlBmxhY3V0ZQd1bmkwMTNCB3VuaTAxM0MGTGNhcm9uBmxjYXJvbgRMZG90BGxkb3QGTmFjdXRlBm5hY3V0ZQd1bmkwMTQ1B3VuaTAxNDYGTmNhcm9uBm5jYXJvbgdPbWFjcm9uB29tYWNyb24HdW5pMDE0RQd1bmkwMTRGDU9odW5nYXJ1bWxhdXQNb2h1bmdhcnVtbGF1dAZSYWN1dGUGcmFjdXRlB3VuaTAxNTYHdW5pMDE1NwZSY2Fyb24GcmNhcm9uBlNhY3V0ZQZzYWN1dGUHdW5pMDE1RQd1bmkwMTVGB3VuaTAxNjIHdW5pMDE2MwZUY2Fyb24GdGNhcm9uBlV0aWxkZQZ1dGlsZGUHVW1hY3Jvbgd1bWFjcm9uBlVicmV2ZQZ1YnJldmUFVXJpbmcFdXJpbmcNVWh1bmdhcnVtbGF1dA11aHVuZ2FydW1sYXV0B1VvZ29uZWsHdW9nb25lawtXY2lyY3VtZmxleAt3Y2lyY3VtZmxleAtZY2lyY3VtZmxleAt5Y2lyY3VtZmxleAZaYWN1dGUGemFjdXRlClpkb3RhY2NlbnQKemRvdGFjY2VudAd1bmkwMThGB3VuaTAxRkMHdW5pMDFGRAd1bmkwMjE4B3VuaTAyMTkHdW5pMDIxQQd1bmkwMjFCB3VuaTAyNTkHdW5pMDJCQwd1bmkwMkM5BldncmF2ZQZ3Z3JhdmUGV2FjdXRlBndhY3V0ZQlXZGllcmVzaXMJd2RpZXJlc2lzB3VuaTFFQkMHdW5pMUVCRAZZZ3JhdmUGeWdyYXZlB3VuaTFFRjgHdW5pMUVGOQRFdXJvB3VuaTIwQkEHdW5pMjBCRAd1bmkyMTEzB3VuaTIxMjYJZXN0aW1hdGVkB3VuaTIyMDYHdW5pMjIxNQd1bmkyMjE5C2V4Y2xhbS5zczAxCmNvbW1hLnNzMDELcGVyaW9kLnNzMDEKY29sb24uc3MwMQ5zZW1pY29sb24uc3MwMQ1xdWVzdGlvbi5zczAxD2V4Y2xhbWRvd24uc3MwMRNwZXJpb2RjZW50ZXJlZC5zczAxEXF1ZXN0aW9uZG93bi5zczAxC2RpdmlkZS5zczAxDnF1b3RlbGVmdC5zczAxD3F1b3RlcmlnaHQuc3MwMRFxdW90ZWRibGxlZnQuc3MwMRJxdW90ZWRibHJpZ2h0LnNzMDENZWxsaXBzaXMuc3MwMQZhLnNzMDILYWFjdXRlLnNzMDILYWJyZXZlLnNzMDIQYWNpcmN1bWZsZXguc3MwMg5hZGllcmVzaXMuc3MwMgthZ3JhdmUuc3MwMgxhbWFjcm9uLnNzMDIMYW9nb25lay5zczAyCmFyaW5nLnNzMDILYXRpbGRlLnNzMDIOYW1wZXJzYW5kLnNzMDMIdHdvLnNzMDQKdGhyZWUuc3MwNAhzaXguc3MwNAluaW5lLnNzMDQAAAAAAQAAAAoAlgIyAANERkxUAGRkZXYyADxkZXZhABQABAAAAAD//wAPAAIABQAIAAsADgARABQAFwAaAB8AIgAlACgAKwAsAAQAAAAA//8ADwABAAQABwAKAA0AEAATABYAGQAcAB4AIQAkACcAKgAEAAAAAP//AA8AAAADAAYACQAMAA8AEgAVABgAGwAdACAAIwAmACkALWFidnMBkmFidnMBkmFidnMBkmFraG4BimFraG4BimFraG4BhGJsd2YBfmJsd2YBfmJsd2YBeGJsd3MBcmJsd3MBcmJsd3MBcmhhbGYBamhhbGYBamhhbGYBZGhhbG4BXmhhbG4BXmhhbG4BXm51a3QBWG51a3QBWG51a3QBWHByZXMBUHByZXMBUHByZXMBUHBzdHMBSnBzdHMBSnBzdHMBSnJrcmYBRHJrcmYBRHJwaGYBPnJwaGYBPnJwaGYBPnNzMDEBNHNzMDEBNHNzMDEBNHNzMDIBKnNzMDIBKnNzMDIBKnNzMDMBIHNzMDMBIHNzMDMBIHNzMDQBFnNzMDQBFnNzMDQBFnZhdHUBEAAAAAEACQAGAAEAFwAAAQMABgABABYAAAEC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AeEAAgA3ABIAkACIAIAAegB0AG4AaABiAFwAVgBQAEoARAA+ADgAMgAsACYB2gACAKwB0AACAEsB4AACAEMB3wACAEEB3gACAEAB3AACAD8B2wACAD0B2QACADsB2AACADoB1wACADcB1QACADYB1AACADUB0wACADMB0gACACwBzwACACsB3QADAGsAPQHWAAMAYgBAAdEAAwBXAD0ACQBEAD4AOAAyACwAJgAgABoAFAHNAAIAQQHMAAIAPwHLAAIAPQHJAAIAOQHIAAIAOAHHAAIANwHFAAIAMwHEAAIALgHCAAIAKwAMAFwAVgBQAEoARAA+ADgAMgAsACYAIAAaAcEAAgBDAcAAAgBAAb8AAgA/Ab4AAgA9Ab0AAgA8AbwAAgA5AbsAAgA4AboAAgA3AbgAAgAzAbcAAgAvAbYAAgAuAbkAAwBfAD0AJgFIAUABOAEwASgBIAEYARABCAEAAPgA8ADoAOAA2ADSAMwAxgDAALoAtACuAKgAogCcAJYAkACKAIQAfgB4AHIAbABmAGAAWgBUAE4BqQACAKoBpwACAKkBogACAKcBngACAKYBmAACAKQBtQACAEQBsQACAEMBsAACAEABrwACAD0BrQACADwBqgACADsBqAACADkBpgACADgBpAACADcBoAACADYBnQACADUBmgACADQBlgACADMBlQACADABlAACAC4BkwACACoBkgACACkBkAACACQBtAADAG8APQGyAAMAbwAuAa4AAwBoAD0BrAADAGcAQAGrAAMAZwA9AaUAAwBjAD0BowADAGIAQAGhAAMAYgA9AZ8AAwBhAEABnAADAGAAQAGbAAMAYAA9AZkAAwBfAEMBlwADAF8APQGRAAMAUABDAbMABABvAGgAPQAFACQAHgAYABIADAGPAAIAQAGOAAIAPQGNAAIAPAGLAAIANwGMAAMAYwA9AAwAXABWAFAASgBEAD4AOAAyACwAJgAgABoBhgACAKsBgAACAJcBigACAEABiQACAD0BiAACADwBhwACADsBhQACADoBhAACADcBgwACADYBggACADUBgQACACcBfwACACYAAwAUAA4ACAF+AAIAQAF9AAIAPQF8AAIANwAaAN4A1gDOAMYAvgC2AK4ApgCeAJYAkACKAIQAfgB4AHIAbABmAGAAWgBUAE4ASABCADwANgFvAAIAqQFn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AAQArwACAJQAAQAEAK4AAgCUAAEABACtAAIAlAABAAQArAACAJQAAQAEAKsAAgCUAAEABACqAAIAlAABAAQAqQACAJQAAQAEAKgAAgCUAAEABACnAAIAlAABAAQApgACAJQAAQAEAKUAAgCUAAEABACkAAIAlAABAAQAowACAJQAAQAEAKIAAgCUAAEABAChAAIAlAABAAQAoAACAJQAAQAEAJ8AAgCUAAEABACeAAIAlAABAAQAnQACAJQAAQAEAJwAAgCUAAEABACbAAIAlAABAAQAmgACAJQAAQAEAJkAAgCUAAEABACYAAIAlAABAAQAlwACAJQAAQAEAJYAAgCUAAEABACVAAIAlAACAAcAJAA9AAAAPwBFABoASABLACEATgBOACUAUABpACYAawBxAEAAdAB4AEcABAAAAAEACAABAc4AJgHEAboBsAGmAZwBkgGIAX4BdAFqAWABVgFMAUIBOAEuASQBGgEQAQYA/ADyAOgA3gDUAMoAwAC2AKwAogCYAI4AhAB6AHAAZgBcAFIAAQAEAOAAAgB9AAEABADfAAIAfQABAAQA3gACAH0AAQAEAN0AAgB9AAEABADcAAIAfQABAAQA2wACAH0AAQAEANoAAgB9AAEABADZAAIAfQABAAQA2AACAH0AAQAEANcAAgB9AAEABADWAAIAfQABAAQA1QACAH0AAQAEANQAAgB9AAEABADTAAIAfQABAAQA0gACAH0AAQAEANEAAgB9AAEABADQAAIAfQABAAQAzwACAH0AAQAEAM4AAgB9AAEABADNAAIAfQABAAQAzAACAH0AAQAEAMsAAgB9AAEABADKAAIAfQABAAQAyQACAH0AAQAEAMgAAgB9AAEABADHAAIAfQABAAQAxgACAH0AAQAEAMUAAgB9AAEABADEAAIAfQABAAQAwwACAH0AAQAEAMIAAgB9AAEABADBAAIAfQABAAQAwAACAH0AAQAEAL8AAgB9AAEABAC+AAIAfQABAAQAvQACAH0AAQAEALwAAgB9AAEABAC7AAIAfQACAAEAlQC6AAAABAAAAAEACAABAfQAKgHqAeAB1gHMAcIBuAGuAaQBmgGQAYYBfAFyAWgBXgFUAUoBQAE2ASwBIgEYAQ4BBAD6APAA5gDcANIAyAC+ALQAqgCgAJYAjACCAHgAbgBkAFoA5gABAAQAeAAC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";

      doc.addFileToVFS("Poppins-Regular.ttf", font);
      // Set the font style
      doc.addFont("Poppins-Regular.ttf", "Poppins-Regular", "normal");

      this.showLoader();

      timeLine.style.minWidth = timeLine.scrollWidth + "px";
      timeLine.style.height = sidebar.scrollHeight + "px";
      sidebar.style.height = element.scrollHeight + "px";
      let that = this;
      doc.html(element, {
        x: margin,
        y: margin,
        css: "./newStyle.css",
        html2canvas: {
          scale: scale,
        },
        callback: function (doc) {
          doc.save(`${name}.pdf`);
          timeLine.style.minWidth = "";
          timeLine.style.height = "";
          sidebar.style.height = "";
          that.hideLoader();
        },
      });
    },

    //export Gantt as Excel
    exportToExcel: function (name = "ztGantt") {
      let csv = "";

      // Create the header row
      let headerRow = this.options.columns
        .map((col) => col.label.replaceAll(",", " "))
        .join(",");
      let right = this.options.rightGrid;
      if (right) {
        headerRow +=
          "," + right.map((col) => col.label.replaceAll(",", " ")).join(",");
      }

      csv += headerRow + "\n";

      // Call the recursive function to convert data to CSV
      csv += convertToCSV(this.options.data, this.options.columns, right);

      // Recursive function to convert data to CSV
      function convertToCSV(array, columns, right) {
        let csvData = "";

        array.forEach((obj) => {
          let rowData = columns.map((col) =>
            col
              .template(obj)
              .replaceAll(",", " ")
              .replace(/<[^>]*>/g, "")
          );
          if (right) {
            rowData.push(
              ...right.map((col) =>
                col
                  .template(obj)
                  .replaceAll(",", " ")
                  .replace(/<[^>]*>/g, "")
              )
            );
          }
          csvData += rowData.join(",") + "\n";

          if (obj.children && obj.children.length > 0) {
            csvData += convertToCSV(obj.children, columns, right);
          }
        });

        return csvData;
      }

      // Create a download link
      var link = document.createElement("a");
      link.setAttribute(
        "href",
        "data:application/vnd.ms-excel," + encodeURIComponent(csv)
      );
      link.setAttribute("download", `${name}.xls`); // Set the custom filename
      // Programmatically trigger the download
      link.click();
    },

    createChildTask: function (
      taskData,
      options,
      leftDataContainer,
      nestedLevel,
      parentIdString,
      isRight,
      isOpened
    ) {
      // if children exist
      if (taskData && taskData?.length > 0) {
        // loop through all the children
        for (let l = 0; l < taskData.length; l++) {
          if (this.searchedData) {
            this.options.openedTasks.push(taskData[l].id);
          }
          let taskParents = `${parentIdString}${l}`;
          let dataItem = document.createElement("div");
          dataItem.classList.add(
            "zt-gantt-row-item",
            "zt-gantt-child-row",
            `zt-gantt-child-${taskData[l].parent}`,
            !isOpened ? "d-none" : "d-flex",
            this.options.selectedRow === `${taskData[l].id}`
              ? "zt-gantt-selected"
              : "zt-gantt-row-item"
          );

          //add custom classes from user
          if (typeof this.templates.grid_row_class === "function") {
            let startDate, endDate;
            let start_date, end_date;
            start_date = taskData[l].start_date;
            end_date = taskData[l].end_date || taskData[l].start_date;

            if (taskData[l].children && taskData[l].children.length > 0) {
              let data = [...taskData[l].children];
              let startAndEndDate = this.getStartAndEndDate(data);
              let start = startAndEndDate.startDate;
              let end = startAndEndDate.endDate;

              const setDate = (date) => {
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);
                return d;
              };

              const dates = [
                setDate(start_date),
                setDate(start),
                setDate(end_date),
                setDate(end),
              ];

              start_date = new Date(Math.min(...dates));
              end_date = new Date(Math.max(...dates));
            }

            let cssClass = this.templates.grid_row_class(
              startDate,
              endDate,
              taskData[l]
            );
            if (cssClass) {
              cssClass = cssClass.trim().replace(/\s+/g, " ").split(" ");
              dataItem.classList.add(...cssClass);
            }
          }

          dataItem.setAttribute("zt-gantt-data-task-id", `${taskParents}`);
          dataItem.setAttribute("zt-gantt-task-id", taskData[l].id);
          dataItem.style.height = options.row_height + "px";
          dataItem.style.lineHeight = options.row_height + "px";
          let that = this;

          // handle double click event
          dataItem.addEventListener("dblclick", handleDblClick);

          function handleDblClick(e) {
            if (e.target.classList.contains("zt-gantt-tree-icon")) {
              return;
            }
            that.createLightbox(taskData[l]);
            const onTaskDblClick = new CustomEvent("onTaskDblClick", {
              detail: {
                task: taskData[l],
              },
            });
            that.element.dispatchEvent(onTaskDblClick);
          }

          let start_date, end_date;
          // Handle mouseover event
          dataItem.addEventListener("mouseover", handleMouseOver);

          function handleMouseOver() {
            let tooltip = document.getElementById("zt-gantt-tooltip");
            tooltip.innerHTML = "";
            start_date = taskData[l].start_date;
            end_date = taskData[l].end_date || taskData[l].start_date;

            if (taskData[l].children && taskData[l].children.length > 0) {
              let data = [...taskData[l].children];
              let startAndEndDate = that.getStartAndEndDate(data);
              let start = startAndEndDate.startDate;
              let end = startAndEndDate.endDate;

              const setDate = (date) => {
                const d = new Date(date);
                d.setHours(0, 0, 0, 0);
                return d;
              };

              const dates = [
                setDate(start_date),
                setDate(start),
                setDate(end_date),
                setDate(end),
              ];

              start_date = new Date(Math.min(...dates));
              end_date = new Date(Math.max(...dates));
            }

            tooltip.innerHTML = that.templates.tooltip_text(
              start_date,
              end_date,
              taskData[l]
            );
            tooltip.style.display = "block";
          }

          // Handle mouseleave event
          dataItem.addEventListener("mouseleave", handleMouseLeave);

          function handleMouseLeave() {
            let tooltip = document.getElementById("zt-gantt-tooltip");
            tooltip.innerHTML = "";
            tooltip.style.display = "none";
          }

          this.addClickListener(dataItem, (e) => {
            if (e.target.classList.contains("zt-gantt-tree-icon")) {
              return;
            }

            let selectedRows = document.querySelectorAll(".zt-gantt-selected");
            let selectedTaskBars = document.querySelectorAll(
              ".zt-gantt-selected-task-bar"
            );

            // scroll horizontall scroll
            let horizontalScroll = document.querySelector(
              ".zt-gantt-hor-scroll"
            );

            cellBefore =
              document.querySelector(
                `[zt-gantt-taskbar-id="${taskData[l].id}"]`
              ).offsetLeft - 80;

            if (horizontalScroll) {
              horizontalScroll.scrollLeft = cellBefore < 0 ? 0 : cellBefore;
            }

            for (let item of selectedRows) {
              item.classList.remove("zt-gantt-selected");
            }

            for (let item of selectedTaskBars) {
              item.classList.remove("zt-gantt-selected-task-bar");
            }

            // select the selected task taskBar
            let currentTaskBar = document.querySelector(
              `[zt-gantt-taskbar-id="${taskData[l].id}"]`
            );
            currentTaskBar.classList.add("zt-gantt-selected-task-bar");

            let taskRow = document.querySelectorAll(
              `[zt-gantt-data-task-id="${taskParents}"]`
            );
            for (let item of taskRow) {
              item.classList.add("zt-gantt-selected");
            }
            that.options.selectedRow = `${taskData[l].id}`;
            that.options.selectedTask = `${taskData[l].id}`;
          });

          // loop through all the columns
          for (let k = 0; k < options.columns.length; k++) {
            let cell = document.createElement("div");
            cell.classList.add("zt-gantt-cell");

            //add custom class from user
            if (typeof this.templates.grid_cell_class === "function") {
              let cssClass = this.templates.grid_cell_class(
                options.columns[k],
                taskData[l]
              );
              if (cssClass) {
                cssClass = cssClass.trim().replace(/\s+/g, " ").split(" ");
                cell.classList.add(...cssClass);
              }
            }

            cell.style.width = (options.columns[k].width || 80) + "px";
            options.columns[k].align
              ? (cell.style.textAlign = options.columns[k].align)
              : "";
            options.columns[k].align
              ? (cell.style.justifyContent = options.columns[k].align)
              : "";

            let ztGanttBlank = document.createElement("div");
            ztGanttBlank.classList.add("zt-gantt-blank");

            // content
            let content = document.createElement("div");
            content.classList.add(
              "zt-gantt-cell-data",
              "zt-gantt-child-cell",
              `${k == 0 ? "d-block" : "zt-gantt-child-data"}`
            );
            if (isRight) {
              cell.setAttribute("data-column-index", "r-" + k);
            } else {
              cell.setAttribute("data-column-index", k);
            }
            content.innerHTML =
              options.columns[k].template(taskData[l]) ||
              taskData[l][options.columns[k].name] ||
              " ";

            // update content innerHTML on after task update
            this.attachEvent("onAfterTaskUpdate", (e) => {
              content.innerHTML =
                options.columns[k].template(taskData[l]) ||
                taskData[l][options.columns[k].name] ||
                " ";
            });

            // update content innerHTML on after progress drag
            this.attachEvent("onAfterProgressDrag", (e) => {
              content.innerHTML =
                options.columns[k].template(taskData[l]) ||
                taskData[l][options.columns[k].name] ||
                " ";
            });

            // update content innerHTML on task drag
            this.attachEvent("onTaskDrag", (e) => {
              content.innerHTML =
                options.columns[k].template(taskData[l]) ||
                taskData[l][options.columns[k].name] ||
                " ";
            });

            // update content innerHTML on after task drag
            this.attachEvent("onAfterTaskDrag", (e) => {
              content.innerHTML =
                options.columns[k].template(taskData[l]) ||
                taskData[l][options.columns[k].name] ||
                " ";
            });

            if (options.columns[k].tree) {
              // file icon
              let file = document.createElement("div");
              file.classList.add("zt-gantt-file-icon");
              file.innerHTML = this.templates.grid_file(taskData[l]);

              //add child indentation
              for (let n = 0; n < nestedLevel; n++) {
                let indent = document.createElement("div");
                indent.classList.add("zt-gantt-indent");
                cell.append(indent);
              }
              cell.classList.add("d-flex");

              if (taskData[l].children && taskData[l].children.length > 0) {
                // tree icon
                let treeIcon = document.createElement("div");
                treeIcon.classList.add(
                  "zt-gantt-tree-icon",
                  !this.options.openedTasks.includes(taskData[l].id)
                    ? "zt-gantt-tree-close"
                    : "zt-gantt-tree-open"
                );
                cell.append(treeIcon);

                let that = this;
                setTimeout(() => {
                  let toggleTreeIcon = treeIcon;
                  this.addClickListener(toggleTreeIcon, (event) => {
                    let children = document.getElementsByClassName(
                      `zt-gantt-child-${taskData[l].id}`
                    );
                    if (
                      toggleTreeIcon.classList.contains("zt-gantt-tree-close")
                    ) {
                      that.options.openedTasks.push(taskData[l].id);
                      that.options.openedTasks = [
                        ...new Set(that.options.openedTasks),
                      ];

                      let t = 0;
                      for (const child of taskData[l].children) {
                        if (child.children) {
                          that.setCollapseAll(child.children, child.id, "open");
                        }
                        t += 1;
                      }
                    } else {
                      const openedTask = that.options.openedTasks.indexOf(
                        taskData[l].id
                      );
                      if (openedTask > -1) {
                        that.options.openedTasks.splice(openedTask, 1);
                      }
                      let t = 0;
                      for (const child of taskData[l].children) {
                        if (child.children) {
                          that.setCollapseAll(
                            child.children,
                            child.id,
                            "collapse"
                          );
                        }
                        t += 1;
                      }
                    }
                    that.createTaskBars();
                    toggleTreeIcon.classList.toggle("zt-gantt-tree-close");
                    toggleTreeIcon.classList.toggle("zt-gantt-tree-open");
                    for (let i = 0; i < children.length; i++) {
                      children[i].classList.toggle("d-none");
                      children[i].classList.toggle("d-flex");
                    }
                    let mainContainer =
                      document.querySelector("#zt-gantt-layout");
                    that.createScrollbar(mainContainer, options);
                  });
                }, 0);
              } else {
                cell.append(ztGanttBlank);
              }
              cell.append(file);
            }
            cell.append(content);
            dataItem.append(cell);
          }

          let isTaskExist = this.getTask(taskData[l].id, this.searchedData);
          if (!this.searchedData || isTaskExist) {
            leftDataContainer.append(dataItem);
          }

          this.createChildTask(
            taskData[l].children,
            options,
            leftDataContainer,
            nestedLevel + 1,
            taskParents,
            isRight,
            isOpened
              ? this.options.openedTasks.includes(taskData[l].id)
              : isOpened
          );
        }
      }
    },

    createBodyChildTask: function (
      taskData,
      options,
      j,
      dates,
      weekday,
      ztGanttTaskData,
      parentIdString,
      isOpened
    ) {
      // loop through all the children
      for (let l = 0; l < taskData.length; l++) {
        let taskParents = `${parentIdString}${l}`;
        let scaleRow = document.createElement("div");
        const isCollapsed = !options.openedTasks.includes(taskData[l].parent);
        scaleRow.classList.add(
          "zt-gantt-task-row",
          "zt-gantt-child-row",
          `zt-gantt-child-${taskData[l].parent}`,
          isCollapsed || !isOpened ? "d-none" : "zt-gantt-task-row",
          options.selectedRow === `${taskData[l].id}`
            ? "zt-gantt-selected"
            : "zt-gantt-task-row"
        );

        //add custom classes from user
        if (typeof this.templates.task_row_class === "function") {
          let startDate, endDate;
          if (Array.isArray(taskData[l].children)) {
            let data = [...taskData[l].children];
            let dateData = this.getStartAndEndDate(data);
            startDate = dateData.startDate;
            endDate = dateData.endDate;
          } else {
            startDate = taskData[l].start_date;
            endDate = taskData[l].end_date;
          }
          let cssClass = this.templates.task_row_class(
            startDate,
            endDate,
            taskData[l]
          );
          if (cssClass) {
            cssClass = cssClass.trim().replace(/\s+/g, " ").split(" ");
            scaleRow.classList.add(...cssClass);
          }
        }

        scaleRow.setAttribute("zt-gantt-data-task-id", taskParents);
        scaleRow.style.height = `${options.row_height}px`;
        let cellEndDate = new Date(0);
        let rangeCount = 0;
        // loop through all the dates
        for (let k = 0; k < dates.length; k++) {
          let date = new Date(dates[k]);
          if (new Date(cellEndDate).getTime() >= date.setHours(0, 0, 0, 0)) {
            continue;
          }
          let colDates;
          let scaleCell = document.createElement("div");
          scaleCell.classList.add("zt-gantt-task-cell");

          if (this.options.zoomLevel !== "day") {
            colDates = this.initColSizes(this.options.zoomLevel, 1, date);
          } else {
            const isWeekend = options.weekends.includes(weekday[date.getDay()]);
            const isFirstCell = k === 0;
            scaleCell.classList.add(
              isWeekend ? "zt-gantt-weekend-cell" : "zt-gantt-weekday-cell",
              isFirstCell ? "border-left-none" : "zt-gantt-task-cell"
            );
          }

          //add custom classes from user
          if (typeof this.templates.timeline_cell_class === "function") {
            let cssClass = this.templates.timeline_cell_class(
              taskData[l],
              dates[k]
            );
            if (cssClass) {
              cssClass = cssClass.trim().replace(/\s+/g, " ").split(" ");
              scaleCell.classList.add(...cssClass);
            }
          }

          if (this.options.zoomLevel !== "day") {
            scaleCell.style.left = rangeCount + "px";
            scaleCell.style.width =
              colDates.dateCount.length * this.calculateGridWidth(date) + "px";
          } else {
            scaleCell.style.left = `${this.calculateGridWidth(date) * k}px`;
            scaleCell.style.width = `${this.calculateGridWidth(date)}px`;
          }

          scaleCell.setAttribute(
            "zt-gantt-cell-date",
            this.formatDateToString(
              this.options.zoomLevel === "day"
                ? "%Y-%m-%d"
                : this.options.zoomLevel === "week"
                ? "W-%W"
                : this.options.zoomLevel === "month"
                ? "M-%m"
                : this.options.zoomLevel === "quarter"
                ? "Q-%q"
                : "%Y",
              date
            )
          );

          scaleCell.setAttribute("zt-gantt-task-id", taskData[l].id);
          let currentDate = new Date(date).setHours(0);
          if (this.options.zoomLevel === "hour") {
            let cellWidth = this.calculateGridWidth(date);
            for (let i = 0; i < 24; i++) {
              let hourCell = scaleCell.cloneNode(true);
              hourCell.style.left = rangeCount + "px";
              hourCell.style.width = cellWidth + "px";
              rangeCount += cellWidth;
              scaleRow.append(hourCell);
            }
          } else if (
            this.options.zoomLevel !== "day" &&
            new Date(cellEndDate).getTime() < currentDate
          ) {
            rangeCount +=
              colDates.dateCount.length * this.calculateGridWidth(date);
            cellEndDate = new Date(colDates.endDate);
            scaleRow.append(scaleCell);
          } else if (this.options.zoomLevel === "day") {
            scaleRow.append(scaleCell);
          }

          // handle cell click event
          let that = this;
          scaleCell.addEventListener("click", function (e) {
            const onCellClick = new CustomEvent("onCellClick", {
              detail: {
                task: taskData[l],
                cellDate: that.formatDateToString(
                  that.options.zoomLevel === "day"
                    ? "%Y-%m-%d"
                    : that.options.zoomLevel === "week"
                    ? "W-%W"
                    : that.options.zoomLevel === "month"
                    ? "M-%m"
                    : that.options.zoomLevel === "quarter"
                    ? "Q-%q"
                    : "%Y",
                  date
                ),
              },
            });
            that.element.dispatchEvent(onCellClick);
          });
        }

        let isTaskExist = this.getTask(taskData[l].id, this.searchedData);
        if (!this.searchedData || isTaskExist) {
          ztGanttTaskData.append(scaleRow);
        }

        // if children exist
        if (taskData[l].children) {
          this.createBodyChildTask(
            taskData[l].children,
            options,
            j,
            dates,
            weekday,
            ztGanttTaskData,
            taskParents,
            isOpened
              ? this.options.openedTasks.includes(taskData[l].id)
              : isOpened
          );
        }
      }
    },

    createChildTaskBars: function (
      taskData,
      rowCount,
      cellStartDate,
      ztGanttBarsArea,
      j
    ) {
      // loop through all children
      for (let k = 0; k < taskData.length; k++) {
        let taskParents = `${j}${k}`;
        let isTaskExist = this.getTask(taskData[k].id, this.searchedData);

        let start_date = taskData[k].start_date;
        let end_date = taskData[k].end_date || taskData[k].start_date;

        if (taskData[k].children && taskData[k].children.length > 0) {
          let data = [...taskData[k].children];
          let startAndEndDate = this.getStartAndEndDate(data);
          let start = startAndEndDate.startDate;
          let end = startAndEndDate.endDate;

          const setDate = (date) => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d;
          };

          const dates = [
            setDate(start_date),
            setDate(start),
            setDate(end_date),
            setDate(end),
          ];

          start_date = new Date(Math.min(...dates));
          end_date = new Date(Math.max(...dates));
        }

        let isCellGreater = true;
        let cellBefore = this.getDates(
          cellStartDate,
          taskData[k].type === "milestone" ? taskData[k].start_date : start_date
        );

        if (cellBefore.length === 0) {
          cellBefore = this.getDates(start_date, cellStartDate);
          isCellGreater = false;
        }

        if (!this.options.fullWeek) {
          cellBefore = cellBefore.filter((date) => {
            return !this.options.weekends.includes(
              this.options.dateFormat.day_short[new Date(date).getDay()]
            );
          });
        }

        if (isCellGreater) {
          cellBefore = cellBefore.length - 1;
        } else {
          cellBefore = -(cellBefore.length - 1);
        }

        let ztGanttBarTask = document.createElement("div");
        if (taskData[k].type === "milestone") {
          ztGanttBarTask.classList.add(
            "zt-gantt-bar-task",
            "zt-gantt-bar-milestone",
            this.options.selectedTask === `${taskData[k].id}`
              ? "zt-gantt-selected-task-bar"
              : "zt-gantt-bar-milestone"
          );
        } else {
          ztGanttBarTask.classList.add(
            "zt-gantt-bar-task",
            this.options.selectedTask === `${taskData[k].id}`
              ? "zt-gantt-selected-task-bar"
              : "zt-gantt-bar-task"
          );
        }

        if (taskData[k].taskColor && taskData[k].type !== "milestone") {
          ztGanttBarTask.style.setProperty(
            "background-color",
            this.changeOpacity(taskData[k].taskColor, this.options.taskOpacity),
            "important"
          );
          ztGanttBarTask.style.setProperty(
            "border-color",
            taskData[k].taskColor,
            "important"
          );
        }

        //add custom class from user
        if (typeof this.templates.task_class === "function") {
          let cssClass = this.templates.task_class(
            start_date,
            end_date,
            taskData[k]
          );
          if (cssClass) {
            cssClass = cssClass.trim().replace(/\s+/g, " ").split(" ");
            ztGanttBarTask.classList.add(...cssClass);
          }
        }

        ztGanttBarTask.setAttribute("task-parent", taskParents);
        ztGanttBarTask.setAttribute("data-task-pos", k);
        ztGanttBarTask.setAttribute("zt-gantt-taskbar-id", taskData[k].id);

        let taskLeft = cellBefore * this.calculateGridWidth(start_date, "day");

        let hourLeft = this.getPxByTime(start_date, "left");
        taskLeft += hourLeft;

        ztGanttBarTask.style.left = taskLeft + "px";

        ztGanttBarTask.style.top =
          rowCount * this.options.row_height +
          Math.floor((this.options.row_height * 10) / 100) +
          "px";
        let barTaskHeight = Math.floor((this.options.row_height * 80) / 100);
        ztGanttBarTask.style.height = `${barTaskHeight}px`;
        ztGanttBarTask.style.lineHeight = `${barTaskHeight}px`;
        if (taskData[k].type === "milestone") {
          ztGanttBarTask.style.width = `${barTaskHeight}px`;
          ztGanttBarTask.style.left =
            (cellBefore + 1) * this.calculateGridWidth(start_date, "day") +
            "px";
        }

        let ztGanttBarTaskContent = document.createElement("div");
        ztGanttBarTaskContent.classList.add(
          "zt-gantt-bar-task-content",
          "child-task-bar-content"
        );

        if (taskData[k].type === "milestone" && taskData[k].taskColor) {
          ztGanttBarTaskContent.style.setProperty(
            "background-color",
            taskData[k].taskColor,
            "important"
          );
        }

        let that = this;

        // handle double click event
        ztGanttBarTask.addEventListener("dblclick", handleDblClick);

        function handleDblClick(e) {
          that.createLightbox(taskData[k]);
          const onTaskDblClick = new CustomEvent("onTaskDblClick", {
            detail: {
              task: taskData[k],
            },
          });
          that.element.dispatchEvent(onTaskDblClick);
        }

        // Handle mouseover event
        ztGanttBarTask.addEventListener("mouseover", handleMouseOver);

        function handleMouseOver() {
          let tooltip = document.getElementById("zt-gantt-tooltip");
          tooltip.innerHTML = "";

          let start_date = taskData[k].start_date;
          let end_date = taskData[k].end_date || taskData[k].start_date;

          if (taskData[k].children && taskData[k].children.length > 0) {
            let data = [...taskData[k].children];
            let startAndEndDate = that.getStartAndEndDate(data);
            let start = startAndEndDate.startDate;
            let end = startAndEndDate.endDate;

            const setDate = (date) => {
              const d = new Date(date);
              d.setHours(0, 0, 0, 0);
              return d;
            };

            const dates = [
              setDate(start_date),
              setDate(start),
              setDate(end_date),
              setDate(end),
            ];

            start_date = new Date(Math.min(...dates));
            end_date = new Date(Math.max(...dates));
          }

          tooltip.innerHTML = that.templates.tooltip_text(
            taskData[k].type === "milestone"
              ? taskData[k].start_date
              : start_date,
            taskData[k].type === "milestone"
              ? taskData[k].end_date || taskData[k].start_date
              : end_date || start_date,
            taskData[k]
          );
          tooltip.style.display = "block";
        }

        // Handle mouseleave event
        ztGanttBarTask.addEventListener("mouseleave", handleMouseLeave);

        function handleMouseLeave() {
          let tooltip = document.getElementById("zt-gantt-tooltip");
          tooltip.innerHTML = "";
          tooltip.style.display = "none";
        }

        if (
          this.templates.task_drag("resize", taskData[k]) &&
          taskData[k].type !== "milestone"
        ) {
          let ztGanttTaskDragLeft = document.createElement("div");
          ztGanttTaskDragLeft.classList.add("zt-gantt-task-drag-left");
          let ztGanttTaskDragRight = document.createElement("div");
          ztGanttTaskDragRight.classList.add("zt-gantt-task-drag-right");

          ztGanttBarTask.append(ztGanttTaskDragLeft, ztGanttTaskDragRight);
          this.resizeTaskBars(
            ztGanttTaskDragLeft,
            ztGanttBarTask,
            "left",
            taskData[k]
          );
          this.resizeTaskBars(
            ztGanttTaskDragRight,
            ztGanttBarTask,
            "right",
            taskData[k]
          );
        }

        if (this.templates.task_drag("move", taskData[k])) {
          this.resizeTaskBars(
            ztGanttBarTaskContent,
            ztGanttBarTask,
            "move",
            taskData[k]
          );
        }

        // link control pointers
        if (this.options.addLinks === true) {
          // left point
          let leftLinkPoint = document.createElement("div");
          leftLinkPoint.classList.add(
            "zt-gantt-link-control",
            "zt-gantt-left-point"
          );
          let leftPoint = document.createElement("div");
          leftPoint.classList.add("zt-gantt-link-point");

          // right point
          let rightLinkPoint = document.createElement("div");
          rightLinkPoint.classList.add(
            "zt-gantt-link-control",
            "zt-gantt-right-point"
          );
          let rightPoint = document.createElement("div");
          rightPoint.classList.add("zt-gantt-link-point");

          leftLinkPoint.append(leftPoint);
          rightLinkPoint.append(rightPoint);
          ztGanttBarTask.append(leftLinkPoint, rightLinkPoint);
          this.createNewLink(
            rightPoint,
            ztGanttBarTask,
            taskData[k].id,
            "right"
          );
          this.createNewLink(leftPoint, ztGanttBarTask, taskData[k].id, "left");
        }

        let taskProgress;
        if (
          this.options.taskProgress === true &&
          taskData[k].type !== "milestone"
        ) {
          let progressPer = taskData[k].progress || 0;
          let taskProgressContainer = document.createElement("div");
          taskProgressContainer.classList.add("zt-gantt-task-progress-wrapper");
          taskProgress = document.createElement("div");
          taskProgress.classList.add("zt-gantt-task-progress");
          taskProgress.style.width = `${
            progressPer > 100 ? 100 : progressPer
          }%`;

          if (taskData[k].taskColor) {
            taskProgress.style.setProperty(
              "background-color",
              taskData[k].taskColor,
              "important"
            );
          }

          taskProgressContainer.append(taskProgress);

          let taskProgressDrag = document.createElement("div");
          taskProgressDrag.classList.add("zt-gantt-task-progress-drag");
          taskProgressDrag.style.left = `${
            progressPer > 100 ? 100 : progressPer
          }%`;

          ztGanttBarTask.append(taskProgressContainer, taskProgressDrag);
          this.dragTaskProgress(
            taskProgressDrag,
            taskProgress,
            ztGanttBarTask,
            taskData[k]
          );
        }

        //add custom task color picker
        let isCustomColor =
          typeof this.options.taskColor === "function"
            ? this.options.taskColor(taskData[k])
            : this.options.taskColor;

        if (isCustomColor) {
          let colorPicker = document.createElement("div");
          colorPicker.classList.add("zt-gantt-task-color-picker");
          let colorInput = document.createElement("input");
          colorInput.id = `color-${taskData[k].id}`;
          colorInput.type = "color";
          colorInput.setAttribute(
            "value",
            taskData[k].taskColor ||
              (taskData[k].type === "milestone" ? "#e84855" : "#56a4fd")
          );
          colorPicker.append(colorInput);
          ztGanttBarTask.append(colorPicker);

          this.changeTaskbarColor(
            ztGanttBarTask,
            colorInput,
            taskProgress,
            ztGanttBarTaskContent,
            taskData[k]
          );
        }

        let taskDates = this.getDates(start_date, end_date);

        if (!this.options.fullWeek) {
          taskDates = taskDates.filter((date) => {
            return !this.options.weekends.includes(
              this.options.dateFormat.day_short[new Date(date).getDay()]
            );
          });
        }

        if (taskData[k].type !== "milestone") {
          let taskWidth =
            taskDates.length * this.calculateGridWidth(end_date, "day");

          let hourWidth = this.getPxByTime(end_date, "width");
          let hourLeft = this.getPxByTime(start_date, "left");
          hourWidth += hourLeft;
          taskWidth -= hourWidth;

          ztGanttBarTask.style.width = taskWidth + "px";
        }
        start_date = new Date(start_date).setHours(0, 0, 0);
        end_date = new Date(end_date).setHours(0, 0, 0);
        let sideContent;
        if (taskData[k].type === "milestone") {
          sideContent = document.createElement("div");
          sideContent.classList.add("zt-gantt-side-content");
          sideContent.innerHTML = this.templates.taskbar_text(
            new Date(start_date),
            new Date(end_date),
            taskData[k]
          );
          ztGanttBarTask.append(sideContent);
        } else {
          ztGanttBarTaskContent.innerHTML = this.templates.taskbar_text(
            new Date(start_date),
            new Date(end_date),
            taskData[k]
          );
        }

        this.attachEvent("onAfterTaskUpdate", (event) => {
          if (taskData[k].type === "milestone") {
            sideContent.innerHTML = this.templates.taskbar_text(
              new Date(start_date),
              new Date(end_date),
              taskData[k]
            );
          } else {
            ztGanttBarTaskContent.innerHTML = this.templates.taskbar_text(
              new Date(start_date),
              new Date(end_date),
              taskData[k]
            );
          }
        });

        ztGanttBarTask.append(ztGanttBarTaskContent);

        if (!this.searchedData || isTaskExist) {
          ztGanttBarsArea.append(ztGanttBarTask);
        }

        if (!this.searchedData || isTaskExist) {
          rowCount += 1;
        }

        if (
          taskData[k].children &&
          this.options.openedTasks.includes(taskData[k].id)
        ) {
          rowCount = this.createChildTaskBars(
            taskData[k].children,
            rowCount,
            cellStartDate,
            ztGanttBarsArea,
            taskParents
          );
        }
      }
      return rowCount;
    },

    setAllExpand: function (data, openedTasks) {
      data.forEach((item) => {
        openedTasks.push(item.id);
        if (item.children && item.children.length > 0) {
          openedTasks = this.setAllExpand(item.children, openedTasks);
        }
      });
      return openedTasks;
    },

    setCollapseAll: function (data, parentId, type) {
      const children = document.getElementsByClassName(
        `zt-gantt-child-${parentId}`
      );

      data.forEach((child) => {
        if (child.children && child.children.length > 0) {
          this.setCollapseAll(child.children, child.id, type);
        }
      });

      Array.from(children).forEach((child) => {
        if (type === "collapse") {
          child.classList.add("d-none");
        } else {
          if (this.options.openedTasks.includes(parentId)) {
            child.classList.remove("d-none");
          }
        }
      });
    },

    // create right sidebar
    createRightSidebar: function (options, mainContainer) {
      // sidebar head cells
      let sidebar = document.createElement("div");
      sidebar.classList.add("zt-gantt-right-sidebar-cell");
      sidebar.id = "zt-gantt-grid-right-data";
      let headCellContainer = document.createElement("div");
      headCellContainer.classList.add("right-sidebar-head-cell-container");
      let containerHeight = this.calculateScaleHeight(
        options.scales,
        options.scale_height,
        "header",
        0
      );

      const totalWidth = options.columns.reduce(
        (totalWidth, col) => totalWidth + col.width,
        0
      );

      sidebar.style.width = (this.options.rightGridWidth || totalWidth) + "px";
      sidebar.style.minWidth =
        (this.options.rightGridWidth || totalWidth) + "px";

      headCellContainer.style.height = containerHeight;
      headCellContainer.style.lineHeight = containerHeight;

      setTimeout(() => {
        headCellContainer.style.width = sidebar.offsetWidth + "px";
      }, 0);
      sidebar.append(headCellContainer);
      let resizerLeft = 0;
      // head loop of left side
      for (let i = 0; i < options.columns.length; i++) {
        let headCell = document.createElement("div");
        headCell.classList.add("right-head-cell");

        //add custom class from user
        if (typeof this.templates.grid_header_class === "function") {
          let cssClass = this.templates.grid_header_class(
            options.columns[i],
            i
          );
          if (cssClass) {
            cssClass = cssClass.trim().replace(/\s+/g, " ").split(" ");
            headCell.classList.add(...cssClass);
          }
        }

        headCell.setAttribute("data-column-index", `r-${i}`);
        headCell.style.width = (options.columns[i].width || 80) + "px";
        headCell.innerHTML = options.columns[i].label;
        headCellContainer.append(headCell);
        if (i < options.columns.length) {
          let resizerWrap = document.createElement("div");
          resizerWrap.classList.add("zt-gantt-col-resizer-wrap");
          resizerWrap.id = "zt-gantt-col-resizer-wrap-r-" + i;
          resizerWrap.style.height = this.calculateScaleHeight(
            options.scales,
            options.scale_height,
            "header",
            0
          );

          if (options.columns[i].resize === true) {
            let resizer = document.createElement("div");
            resizer.classList.add("zt-gantt-col-resizer");
            resizerWrap.append(resizer);
            resizerLeft += options.columns[i].width || 80;
            resizerWrap.style.left = resizerLeft + "px";
            headCellContainer.append(resizerWrap);
            this.resizeColumns(
              resizerWrap,
              `data-column-index="r-${i}"`,
              headCell,
              headCellContainer,
              options.columns[i].min_width,
              options.columns[i].max_width,
              i,
              sidebar,
              true
            );
          }
        }
      }

      // data loop of left side
      let leftDataContainer = document.createElement("div");
      leftDataContainer.classList.add("zt-gantt-grid-data");
      leftDataContainer.id = "zt-gantt-left-grid";
      setTimeout(() => {
        leftDataContainer.style.width = sidebar.offsetWidth + "px";
      }, 0);
      // loop through all the data
      for (let j = 0; j < options.data.length; j++) {
        let dataItem = document.createElement("div");
        dataItem.classList.add("zt-gantt-row-item", "d-flex");

        //add custom classes from user
        if (typeof this.templates.grid_row_class === "function") {
          let startDate, endDate;
          if (Array.isArray(options.data[j].children)) {
            let taskData = [...options.data[j].children];
            let dateData = this.getStartAndEndDate(taskData);
            startDate = dateData.startDate;
            endDate = dateData.endDate;
          }
          let cssClass = this.templates.grid_row_class(
            startDate,
            endDate,
            options.data[j]
          );
          if (cssClass) {
            cssClass = cssClass.trim().replace(/\s+/g, " ").split(" ");
            dataItem.classList.add(...cssClass);
          }
        }

        dataItem.setAttribute("zt-gantt-data-task-id", j);
        dataItem.setAttribute("zt-gantt-task-id", options.data[j].id);
        dataItem.style.height = options.row_height + "px";
        dataItem.style.lineHeight = options.row_height + "px";
        let that = this;
        // Handle mouseover event
        dataItem.addEventListener("mouseover", handleMouseOver);

        function handleMouseOver(e) {
          let tooltip = document.getElementById("zt-gantt-tooltip");
          tooltip.innerHTML = "";
          let start_date;
          let end_date;
          if (options.data[j].children) {
            let taskData = [...options.data[j].children];
            let startAndEndDate = that.getStartAndEndDate(taskData);
            start_date = startAndEndDate.startDate;
            end_date = startAndEndDate.endDate;
          }
          tooltip.innerHTML = that.templates.tooltip_text(
            start_date,
            end_date,
            options.data[j]
          );
          tooltip.style.display = "block";
        }

        // Handle mouseleave event
        dataItem.addEventListener("mouseleave", handleMouseLeave);
        function handleMouseLeave(event) {
          let tooltip = document.getElementById("zt-gantt-tooltip");
          tooltip.innerHTML = "";
          tooltip.style.display = "none";
        }

        this.addClickListener(dataItem, (e) => {
          if (e.target.classList.contains("zt-gantt-tree-icon")) {
            return;
          }

          let selectedRows = document.querySelectorAll(".zt-gantt-selected");
          let selectedTaskBars = document.querySelectorAll(
            ".zt-gantt-selected-task-bar"
          );

          for (let item of selectedRows) {
            item.classList.remove("zt-gantt-selected");
          }

          for (let item of selectedTaskBars) {
            item.classList.remove("zt-gantt-selected-task-bar");
          }

          // select the selected task taskBar
          let currentTaskBar = document.querySelector(
            `[zt-gantt-taskbar-id="${options.data[j].id}"]`
          );
          currentTaskBar.classList.add("zt-gantt-selected-task-bar");

          let taskRow = document.querySelectorAll(
            `[zt-gantt-data-task-id="${j}"]`
          );
          for (let item of taskRow) {
            item.classList.add("zt-gantt-selected");
          }
          that.options.selectedRow = `${options.data[j].id}`;
          that.options.selectedTask = `${options.data[j].id}`;
        });

        // loop through all the columns
        for (let k = 0; k < options.columns.length; k++) {
          let cell = document.createElement("div");
          cell.classList.add("zt-gantt-cell");

          //add custom class from user
          if (typeof this.templates.grid_cell_class === "function") {
            let cssClass = this.templates.grid_cell_class(
              options.columns[k],
              options.data[j]
            );
            if (cssClass) {
              cssClass = cssClass.trim().replace(/\s+/g, " ").split(" ");
              cell.classList.add(...cssClass);
            }
          }

          cell.style.width = (options.columns[k].width || 80) + "px";
          options.columns[k].align
            ? (cell.style.textAlign = options.columns[k].align)
            : "";
          options.columns[k].align
            ? (cell.style.justifyContent = options.columns[k].align)
            : "";

          let content = document.createElement("div");
          content.classList.add(
            "zt-gantt-cell-data",
            `${k == 0 ? "d-block" : "zt-gantt-data"}`
          );
          cell.setAttribute("data-column-index", `r-${k}`);

          let ztGanttBlank = document.createElement("div");
          ztGanttBlank.classList.add("zt-gantt-blank");

          // content
          content.innerHTML =
            options.columns[k].template(options.data[j]) ||
            options.data[j][options.columns[k].name] ||
            " ";

          if (options.columns[k].tree) {
            cell.classList.add("d-flex");

            // folder icon
            let folderIcon = document.createElement("div");
            folderIcon.classList.add("zt-gantt-folder-icon");
            folderIcon.innerHTML = this.templates.grid_folder(options.data[j]);

            if (
              options.data[j].children &&
              options.data[j].children.length > 0
            ) {
              // tree icon
              let treeIcon = document.createElement("div");
              treeIcon.classList.add(
                "zt-gantt-tree-icon",
                !this.options.openedTasks.includes(options.data[j].id)
                  ? "zt-gantt-tree-close"
                  : "zt-gantt-tree-open"
              );
              treeIcon.id = `toggle-tree-${j}`;
              cell.append(treeIcon);
              // toggle children
              let that = this;
              setTimeout(() => {
                let toggleTreeIcon = treeIcon;
                this.addClickListener(toggleTreeIcon, (event) => {
                  let children = document.getElementsByClassName(
                    `zt-gantt-child-${j}`
                  );

                  if (
                    toggleTreeIcon.classList.contains("zt-gantt-tree-close")
                  ) {
                    that.options.openedTasks.push(options.data[j].id);
                    that.options.openedTasks = [
                      ...new Set(that.options.openedTasks),
                    ];
                    for (const child of that.options.data[j].children) {
                      if (child.children) {
                        that.setCollapseAll(child.children, child.id, "open");
                      }
                    }
                  } else {
                    const openedTasks = that.options.openedTasks.indexOf(
                      options.data[j]
                    );
                    if (openedTasks > -1) {
                      that.options.openedTasks.splice(openedTasks, 1);
                    }
                    for (const child of this.options.data[j].children) {
                      if (child.children) {
                        that.setCollapseAll(
                          child.children,
                          child.id,
                          "collapse"
                        );
                      }
                    }
                  }

                  that.createTaskBars();

                  for (let i = 0; i < children.length; i++) {
                    children[i].classList.toggle("d-none");
                    children[i].classList.toggle("d-flex");
                  }

                  toggleTreeIcon.classList.toggle("zt-gantt-tree-close");
                  toggleTreeIcon.classList.toggle("zt-gantt-tree-open");
                });
              }, 0);
            } else {
              cell.append(ztGanttBlank);
            }
            cell.append(folderIcon);
          }
          cell.append(content);
          dataItem.append(cell);
        }

        let isTaskExist = this.getTask(options.data[j].id, this.searchedData);
        if (!this.searchedData || isTaskExist) {
          leftDataContainer.append(dataItem);
        }

        this.createChildTask(
          options.data[j].children,
          options,
          leftDataContainer,
          1,
          j,
          true,
          this.options.openedTasks.includes(options.data[j].id)
        );
      }
      sidebar.append(leftDataContainer);

      let timelineResizerWrap = document.createElement("div");
      timelineResizerWrap.classList.add("zt-gantt-timeline-resizer-wrap");
      timelineResizerWrap.id = "zt-gantt-timeline-resizer-wrap";
      timelineResizerWrap.setAttribute("data-html2canvas-ignore", "true");
      let timelineResizer = document.createElement("div");
      timelineResizer.classList.add("zt-gantt-timeline-resizer");
      timelineResizerWrap.append(timelineResizer);
      setTimeout(() => {
        timelineResizerWrap.style.left = sidebar.offsetLeft + "px";
      }, 0);
      mainContainer.append(timelineResizerWrap);
      this.resizeTimeline(timelineResizerWrap, timelineResizer, options);
      mainContainer.append(sidebar);
    },

    // create Custom scrollBar
    createScrollbar: function (
      mainContainer,
      options,
      verScrollPos = 0,
      horScrollPos = 0
    ) {
      const layout = document.querySelector("#zt-gantt-layout");
      const timeline = document.querySelector("#zt-gantt-right-cell");
      const timelineData = document.querySelector("#zt-gantt-scale-data");
      const headerHeight = this.calculateScaleHeight(
        options.scales,
        options.scale_height,
        "scroll",
        0
      );
      const rightSideBar = document.querySelector("#zt-gantt-grid-right-data");

      const isVerScrollExist = document.querySelectorAll(
        ".zt-gantt-ver-scroll-cell"
      );
      const isHorScrollExist = document.querySelectorAll(
        ".zt-gantt-hor-scroll-cell"
      );

      // Create vertical custom scroll
      const verticalScrollContainer = createCustomScrollContainer(
        "zt-gantt-ver-scroll-cell"
      );
      const verticalScroll = createCustomScroll("zt-gantt-ver-scroll");
      verticalScroll.style.top = headerHeight + "px";
      verticalScroll.style.height = `calc(100% - ${headerHeight}px)`;
      const verScrollContent = document.createElement("div");
      verScrollContent.style.height = timelineData.scrollHeight - 1 + "px";
      verticalScroll.append(verScrollContent);
      verticalScrollContainer.append(verticalScroll);

      // if scrolls exist then remove them then create
      removeExistingScrollElements(isVerScrollExist);
      if (timeline.scrollHeight > timeline.offsetHeight) {
        mainContainer.append(verticalScrollContainer);
      }

      // Create horizontal custom scroll
      const horScrollContainer = createCustomScrollContainer(
        "zt-gantt-hor-scroll-cell"
      );
      const horScroll = createCustomScroll("zt-gantt-hor-scroll");
      const horScrollContent = document.createElement("div");
      horScrollContent.style.width =
        timeline.scrollWidth +
        (layout.offsetWidth - timeline.offsetWidth) +
        "px";
      horScroll.append(horScrollContent);
      horScrollContainer.append(horScroll);

      // if scrolls exist then remove them then create
      removeExistingScrollElements(isHorScrollExist);
      if (
        timeline.scrollWidth + (layout.offsetWidth - timeline.offsetWidth) >
        layout.offsetWidth
      ) {
        mainContainer.append(horScrollContainer);
      }

      const sidebar = document.querySelector("#zt-gantt-grid-left-data");
      const calendar = document.querySelector("#zt-gantt-right-cell");

      verticalScroll.scrollTop = verScrollPos || calendar.scrollTop;
      horScroll.scrollLeft = horScrollPos || calendar.scrollLeft;

      let that = this;
      calendar.removeEventListener("scroll", handleCalendarScroll);
      calendar.addEventListener("scroll", handleCalendarScroll);

      function handleCalendarScroll(e) {
        sidebar.scrollTop = calendar.scrollTop;
        horScroll.scrollLeft = calendar.scrollLeft;
        verticalScroll.scrollTop = calendar.scrollTop;
        if (rightSideBar) {
          rightSideBar.scrollTop = calendar.scrollTop;
        }
        const onScroll = new CustomEvent("onScroll", {
          detail: {
            event: e,
          },
        });
        that.element.dispatchEvent(onScroll);
      }

      sidebar.removeEventListener("scroll", handleSidebarScroll);
      sidebar.addEventListener("scroll", handleSidebarScroll);

      function handleSidebarScroll() {
        calendar.scrollTop = sidebar.scrollTop;
        verticalScroll.scrollTop = sidebar.scrollTop;
        if (rightSideBar) {
          rightSideBar.scrollTop = sidebar.scrollTop;
        }
      }

      // for horizontal custom scroller
      horScroll.removeEventListener("scroll", handleHorScroll);
      horScroll.addEventListener("scroll", handleHorScroll);
      function handleHorScroll() {
        calendar.scrollLeft = horScroll.scrollLeft;
      }

      // for rightSideBar custom scroll
      if (rightSideBar) {
        rightSideBar.removeEventListener("scroll", handleRightSidebarScroll);
        rightSideBar.addEventListener("scroll", handleRightSidebarScroll);
        function handleRightSidebarScroll() {
          calendar.scrollTop = rightSideBar.scrollTop;
          verticalScroll.scrollTop = rightSideBar.scrollTop;
          sidebar.scrollTop = rightSideBar.scrollTop;
        }
      }

      // for vertical custom scroller
      verticalScroll.addEventListener("scroll", function () {
        calendar.scrollTop = verticalScroll.scrollTop;
        sidebar.scrollTop = verticalScroll.scrollTop;
        if (rightSideBar) {
          rightSideBar.scrollTop = verticalScroll.scrollTop;
        }
      });

      const timelineResizer = document.querySelector(
        "#zt-gantt-timeline-resizer-wrap"
      );
      if (timelineResizer) {
        timelineResizer.style.left =
          calendar.offsetLeft + calendar.offsetWidth + "px";
      }

      function createCustomScrollContainer(id) {
        const container = document.createElement("div");
        container.id = id;
        container.classList.add(id);
        container.setAttribute("data-html2canvas-ignore", true);
        return container;
      }

      function createCustomScroll(className) {
        const scroll = document.createElement("div");
        scroll.classList.add(className);
        return scroll;
      }

      function removeExistingScrollElements(scrollElements) {
        if (scrollElements) {
          for (let scroll of scrollElements) {
            scroll.remove();
          }
        }
      }
    },

    resizeTimeline: function (resizer, resizerLine, options) {
      let timeLineResizing = false,
        that = this,
        startX,
        timeLine;

      resizer.removeEventListener("mousedown", handleMouseDown);
      resizer.addEventListener("mousedown", handleMouseDown);

      function handleMouseDown(event) {
        timeLine = document.querySelector("#zt-gantt-right-cell");
        startX = event.x;
        resizerLine.style.backgroundColor = "#218eed";

        // mouse move event
        document.addEventListener("mousemove", resize, false);
        // mouseup event
        document.addEventListener("mouseup", handleMouseUp, false);
      }

      function handleMouseUp(e) {
        document.removeEventListener("mousemove", resize, false);
        document.removeEventListener("mouseup", handleMouseUp, false);
        if (timeLineResizing) {
          let resizerLeft = 0,
            headerCell = document.getElementsByClassName("right-head-cell");

          // rerender the calendar and scale
          if (
            that.calculateTimeLineWidth("updated") !==
            that.calculateTimeLineWidth("current")
          ) {
            that.updateBody();
          }
          for (let j = 0; j < headerCell.length; j++) {
            let columns = document.querySelectorAll(
              `[data-column-index="r-${j}"]`
            );
            let incrasedWidth =
              headerCell[j].offsetWidth +
              Math.floor((startX - e.x) / options.columns.length);

            let resizerWrap = document.getElementById(
              `zt-gantt-col-resizer-wrap-r-${j}`
            );

            incrasedWidth =
              incrasedWidth > (options.columns[j]?.min_width || 80)
                ? incrasedWidth
                : options.columns[j]?.min_width || 80;

            // set the sidebar columns width
            for (let col of columns) {
              col.style.width = incrasedWidth + "px";
            }

            that.options.rightGrid[j].width = incrasedWidth;

            // set the sidebar columns resizer left
            resizerLeft += headerCell[j].offsetWidth;
            if (resizerWrap) {
              resizerWrap.style.left = resizerLeft + "px";
            }
          }

          let rightSideBar = document.querySelector(
            "#zt-gantt-grid-right-data"
          );

          rightSideBar.style.width =
            rightSideBar.offsetWidth + (startX - e.x) + "px";
          rightSideBar.style.minWidth =
            rightSideBar.offsetWidth + (startX - e.x) + "px";

          that.options.rightGridWidth = rightSideBar.offsetWidth;

          if (
            that.calculateTimeLineWidth("updated") ===
            that.calculateTimeLineWidth("current")
          ) {
            let mainContainer = document.querySelector(".zt-gantt-layout");
            that.createScrollbar(mainContainer, that.options);
          }
        }
        resizerLine.style.backgroundColor = "#cecece";
        timeLineResizing = false;
      }

      // resize the sidebar
      function resize(e) {
        timeLineResizing = true;
        let size = `${
          timeLine.offsetLeft + timeLine.offsetWidth + (e.x - startX)
        }px`;
        resizer.style.left = size;
      }
    },

    getTask: function (id, data = this.options.data) {
      function findObjectById(array, id) {
        for (let item of array) {
          if (item.id == id) {
            return item;
          }

          if (Array.isArray(item.children)) {
            const found = findObjectById(item.children, id);
            if (found) {
              return found;
            }
          }
        }
        return null;
      }

      const task = findObjectById(data, id);
      return task;
    },

    filterTask: function (condition, isFilter) {
      if (!this.searchedData) {
        this.oldOpenedTasks = [...this.options.openedTasks];
      }

      this.selectedRow = undefined;
      const allData = [...this.options.data];
      const data = filterAndFlatten(allData, condition);

      function filterAndFlatten(data, condition) {
        return data.reduce((result, item) => {
          if (condition(item)) {
            const { children, ...flatItem } = item;
            result.push(flatItem);
          }
          if (Array.isArray(item.children)) {
            // Recursively filter and flatten nested arrays
            const filteredItems = filterAndFlatten(item.children, condition);
            result.push(...filteredItems);
          }
          return result;
        }, []);
      }

      if (isFilter === true) {
        this.searchedData = data;
        this.render();
      } else {
        this.searchedData = undefined;
        this.options.openedTasks = [];
        this.render();
      }
    },

    // push custom markers
    addMarker: function (marker) {
      this.options.customMarker.push(marker);
    },

    // add custom marker to gantt
    addMarkerToGantt: function (data) {
      let markerArea = document.querySelector(".zt-gantt-marker-area");

      if (!markerArea) {
        markerArea = document.createElement("div");
        markerArea.classList.add("zt-gantt-marker-area");
      }

      let flag = document.createElement("div");
      flag.classList.add(
        "zt-gantt-marker",
        ...data.css.trim().replace(/\s+/g, " ").split(" ")
      );
      flag.title = data.title;

      let flagText = document.createElement("div");
      flagText.classList.add("zt-gantt-marker-content");
      flagText.innerHTML = data.text;
      flag.append(flagText);

      let calendarContainer = document.getElementById("zt-gantt-scale-data");

      const startDate = new Date(this.options.startDate);
      const markerStartDate = new Date(data.start_date);
      let daysDiff = this.getDates(startDate, markerStartDate);

      if (!this.options.fullWeek) {
        const filteredDates = daysDiff.filter(
          (date) =>
            !this.options.weekends.includes(
              this.options.dateFormat.day_short[new Date(date).getDay()]
            )
        );

        if (
          this.options.weekends.includes(
            this.options.dateFormat.day_short[markerStartDate.getDay()]
          )
        ) {
          return;
        }

        daysDiff = filteredDates.length - 1 || 0;
      } else {
        daysDiff = daysDiff.length - 1 || 0;
      }

      flag.style.left =
        this.calculateGridWidth(data.start_date, "day") * daysDiff + 15 + "px";

      if (calendarContainer) {
        markerArea.append(flag);
        calendarContainer.append(markerArea);
      }
    },

    // attach evnets
    attachEvent: function (name, callback) {
      this.element.removeEventListener(name, handleEvent);
      this.element.addEventListener(name, handleEvent);

      let that = this;
      function handleEvent(e) {
        if (
          name === "onBeforeTaskDrag" ||
          name === "onBeforeTaskDrop" ||
          name === "onBeforeProgressDrag" ||
          name === "onBeforeLinkAdd"
        ) {
          that.eventValue = callback(e.detail);
          that.eventValue = that.eventValue !== false;
        } else {
          callback(e.detail);
        }
      }
    },

    // get the position of a cell
    posFromDate: function (date) {
      date = new Date(date);
      const pxPerHour = this.calculateGridWidth(date) / 24;
      const hours = date.getHours();
      const pixels = Math.floor(hours * pxPerHour);
      let cellBefore = this.getDates(this.options.startDate, date);
      let isCellGreater = true;

      if (cellBefore.length === 0) {
        cellBefore = this.getDates(date, this.options.startDate);
        isCellGreater = false;
      }

      if (!this.options.fullWeek) {
        cellBefore = cellBefore.filter((date) => {
          return !this.options.weekends.includes(
            this.options.dateFormat.day_short[new Date(date).getDay()]
          );
        });
      }

      cellBefore = isCellGreater
        ? cellBefore.length - 1
        : -(cellBefore.length - 1);

      // return the left of the cell of given date
      return Math.floor(cellBefore * this.calculateGridWidth(date) + pixels);
    },

    clearAll: function () {
      this.options.arrangeData = true;
      this.options.openedTasks = [];
    },

    eachTask: function (callBack) {
      const iterateOverData = (array) => {
        array.forEach((task) => {
          callBack(task);
          if (Array.isArray(task.children)) {
            iterateOverData(task.children);
          }
        });
      };

      iterateOverData(this.options.data);
    },

    updateTaskDuration: function () {
      this.eachTask((task) => {
        let start_date = task.start_date;
        let end_date = task.end_date || task.start_date;

        if (task.children && task.children.length > 0) {
          let data = [...task.children];
          let { startDate, endDate } = this.getStartAndEndDate(data);

          const setDate = (date) => {
            const d = new Date(date);
            d.setHours(0, 0, 0, 0);
            return d;
          };

          const dates = [setDate(startDate), setDate(endDate)];

          if (start_date) {
            dates.push(setDate(start_date));
          }
          if (end_date) {
            dates.push(setDate(end_date));
          }

          start_date = new Date(Math.min(...dates));
          end_date = new Date(Math.max(...dates));
        }
        const dates = this.getDates(start_date, end_date);
        task.duration = dates.length;
      });
    },

    // open a specific task tree
    openTask: function (id) {
      if (id === null || id === undefined) {
        return;
      }

      const sidebar = document.querySelector("#zt-gantt-left-grid");
      const taskRow = sidebar.querySelector(`[zt-gantt-task-id="${id}"]`);
      const children = document.querySelectorAll(`.zt-gantt-child-${id}`);
      const mainContainer = document.querySelector("#zt-gantt-layout");
      const toggleTreeIcon = taskRow.querySelector(".zt-gantt-tree-icon");

      let task = this.getTask(id);
      if (task.parent !== 0) {
        this.openTask(task.parent);
      }

      this.options.openedTasks.push(id);
      this.options.openedTasks = [...new Set(this.options.openedTasks)];
      this.createTaskBars();

      children.forEach((child) => {
        child.classList.remove("d-none");
        child.classList.add("d-flex");
      });

      if (toggleTreeIcon) {
        toggleTreeIcon.classList.remove("zt-gantt-tree-close");
        toggleTreeIcon.classList.add("zt-gantt-tree-open");
      }

      this.createScrollbar(mainContainer, this.options);
    },

    // set the new data to the existing data
    parse: function (data) {
      const uniqueData = data.filter((obj) => !this.getTask(obj.id));

      this.options.data = [...this.originalData, ...uniqueData];
      this.options.arrangeData = true;

      if (this.options.collapse === false) {
        // Set opened tasks
        const uniqueIds = uniqueData.map((task) => task.id);
        this.options.openedTasks.push(...uniqueIds);
        this.options.openedTasks = [...new Set(this.options.openedTasks)];
      }
    },

    // split hour and minutes from decimal
    convertDecimalToTime: function (decimalTime) {
      const hours = Math.floor(decimalTime);
      const minutes = Math.round((decimalTime - hours) * 60);
      return { hours, minutes };
    },

    // get time from pixels
    getTimeByPx: function (pixels, date) {
      let pxPerMin = this.calculateGridWidth(date, "day") / (24 * 60);
      let dateTime = pixels / pxPerMin / 60;
      let { hours, minutes } = this.convertDecimalToTime(dateTime);
      return { hours, minutes };
    },

    // get pixels from time
    getPxByTime: function (date, type) {
      let hours = new Date(date).getHours();
      if (type === "width") {
        hours = hours === 0 ? 0 : 23 - hours;
      }
      let pxPerHour = this.calculateGridWidth(date, "day") / 24;
      let pixels = hours * pxPerHour;
      return pixels;
    },

    // function to create links between tasks
    createLinks: function (sourceId, targetId, link) {
      let linksArea = document.querySelector("#zt-gantt-links-area");

      let source = document.querySelector(
        `[zt-gantt-taskbar-id="${sourceId}"]`
      );
      let target = document.querySelector(
        `[zt-gantt-taskbar-id="${targetId}"]`
      );

      let linkType = link.type || 0;

      if (
        source == undefined ||
        source == null ||
        target == undefined ||
        target == null ||
        source == target
      ) {
        return;
      }

      let rowHeight = document.querySelector(".zt-gantt-bar-task").offsetHeight,
        sourceLeft = source.offsetLeft,
        sourceWidth = source.offsetWidth,
        sourceTop = source.offsetTop,
        targetLeft = target.offsetLeft,
        targetWidth = target.offsetWidth,
        targetTop = target.offsetTop,
        extraHeight =
          (this.options.row_height -
            Math.floor((this.options.row_height * 80) / 100)) /
            2 -
          1;

      let taskLink = document.createElement("div");
      taskLink.classList.add("zt-gantt-task-link");
      taskLink.setAttribute("link-id", link.id);
      taskLink.setAttribute("link-type", linkType);
      linksArea.append(taskLink);

      let that = this;
      // handle double click event
      taskLink.addEventListener("dblclick", function (e) {
        const onLinkDblClick = new CustomEvent("onLinkDblClick", {
          detail: {
            link: link,
          },
        });
        that.element.dispatchEvent(onLinkDblClick);
      });

      let startLine = document.createElement("div");
      startLine.classList.add("zt-gantt-hor-link-line", "zt-gantt-link-line");

      let middleLine = document.createElement("div");
      middleLine.classList.add("zt-gantt-ver-link-line", "zt-gantt-link-line");

      let endLine = document.createElement("div");
      endLine.classList.add("zt-gantt-hor-link-line", "zt-gantt-link-line");

      let linkVerInnerLine = document.createElement("div");
      linkVerInnerLine.classList.add("ver-inner-line");

      let linkHorInnerLine = document.createElement("div");
      linkHorInnerLine.classList.add("hor-inner-line");

      if (linkType == 0) {
        startLine.style.left = sourceLeft + sourceWidth + "px";
        startLine.style.top = sourceTop + rowHeight / 2 + "px";
        startLine.style.width = 15 + "px";
        let innerHorLine = linkHorInnerLine.cloneNode(true);
        startLine.append(innerHorLine);
        taskLink.append(startLine);

        if (sourceLeft + sourceWidth + 15 >= targetLeft) {
          let middleLine = document.createElement("div");
          middleLine.classList.add(
            "zt-gantt-ver-link-line",
            "zt-gantt-link-line"
          );
          middleLine.style.left =
            startLine.offsetLeft + startLine.offsetWidth - 2 + "px";
          if (sourceTop < targetTop) {
            middleLine.style.top =
              Math.min(sourceTop, targetTop) + rowHeight / 2 + "px";
            middleLine.style.height =
              source.offsetHeight / 2 + (extraHeight + 2) + "px";
          } else {
            middleLine.style.top =
              Math.min(sourceTop, targetTop) +
              rowHeight +
              (extraHeight + 2) +
              "px";
            middleLine.style.height =
              Math.abs(sourceTop - targetTop) -
              rowHeight / 2 -
              extraHeight +
              "px";
          }
          let innerLine = linkVerInnerLine.cloneNode(true);
          middleLine.append(innerLine);
          taskLink.append(middleLine);

          let horLine = document.createElement("div");
          horLine.classList.add("zt-gantt-hor-link-line", "zt-gantt-link-line");
          horLine.style.left = targetLeft - 15 + "px";
          horLine.style.top =
            Math.min(sourceTop, targetTop) +
            source.offsetHeight +
            extraHeight +
            "px";
          horLine.style.width =
            Math.abs(
              startLine.offsetLeft + startLine.offsetWidth - targetLeft
            ) +
            15 +
            "px";
          let innerHorLine = linkHorInnerLine.cloneNode(true);
          horLine.append(innerHorLine);
          taskLink.append(horLine);
        }

        if (sourceLeft + sourceWidth + 15 >= targetLeft) {
          middleLine.style.left = target.offsetLeft - 15 + "px";
          if (sourceTop < targetTop) {
            middleLine.style.top =
              Math.min(sourceTop, targetTop) +
              rowHeight +
              (extraHeight + 2) +
              "px";
            middleLine.style.height =
              Math.abs(sourceTop - targetTop) -
              rowHeight / 2 -
              extraHeight +
              "px";
          } else {
            middleLine.style.top =
              Math.min(sourceTop, targetTop) + rowHeight / 2 + "px";
            middleLine.style.height =
              source.offsetHeight / 2 + extraHeight + "px";
          }
        } else {
          middleLine.style.left =
            startLine.offsetLeft + startLine.offsetWidth - 2 + "px";
          middleLine.style.top =
            Math.min(sourceTop, targetTop) + rowHeight / 2 + "px";
          middleLine.style.height = Math.abs(sourceTop - targetTop) + "px";
        }
        let innerLine = linkVerInnerLine.cloneNode(true);
        middleLine.append(innerLine);
        taskLink.append(middleLine);

        if (sourceLeft + sourceWidth + 15 >= targetLeft) {
          endLine.style.left = middleLine.offsetLeft + "px";
          endLine.style.top = targetTop + rowHeight / 2 + "px";
          endLine.style.width = 15 + "px";
        } else {
          endLine.style.left = middleLine.offsetLeft + "px";
          endLine.style.top = targetTop + rowHeight / 2 + "px";
          endLine.style.width =
            Math.abs(
              startLine.offsetLeft + startLine.offsetWidth - targetLeft
            ) + "px";
        }

        let innerEndLine = linkHorInnerLine.cloneNode(true);
        endLine.append(innerEndLine);
        taskLink.append(endLine);
      } else if (linkType == 1) {
        startLine.style.left = Math.min(sourceLeft, targetLeft) - 15 + "px";
        startLine.style.top = sourceTop + rowHeight / 2 + "px";
        if (sourceLeft > targetLeft) {
          startLine.style.width = Math.abs(sourceLeft - targetLeft) + 15 + "px";
        } else {
          startLine.style.width = 15 + "px";
        }
        let innerHorLine = linkVerInnerLine.cloneNode(true);
        startLine.append(innerHorLine);
        taskLink.append(startLine);

        if (sourceLeft >= targetLeft) {
          middleLine.style.left = target.offsetLeft - 15 + "px";
          middleLine.style.top =
            Math.min(sourceTop, targetTop) + rowHeight / 2 + "px";
          middleLine.style.height = Math.abs(sourceTop - targetTop) + "px";
        } else {
          middleLine.style.left = startLine.offsetLeft + "px";
          middleLine.style.top =
            Math.min(sourceTop, targetTop) + rowHeight / 2 + "px";
          middleLine.style.height = Math.abs(sourceTop - targetTop) + "px";
        }
        let innerLine = linkVerInnerLine.cloneNode(true);
        middleLine.append(innerLine);
        taskLink.append(middleLine);

        endLine.style.left = middleLine.offsetLeft + "px";
        endLine.style.top = targetTop + rowHeight / 2 + "px";
        endLine.style.width = targetLeft - middleLine.offsetLeft + "px";
        let innerEndLine = linkHorInnerLine.cloneNode(true);
        endLine.append(innerEndLine);
        taskLink.append(endLine);
      } else if (linkType == 2) {
        startLine.style.left = `${sourceLeft + sourceWidth}px`;
        startLine.style.top = `${sourceTop + rowHeight / 2}px`;
        if (sourceLeft + sourceWidth < targetLeft + targetWidth) {
          startLine.style.width = `${
            Math.abs(sourceLeft + sourceWidth - (targetLeft + targetWidth)) + 15
          }px`;
        } else {
          startLine.style.width = `${15}px`;
        }
        let innerHorLine = linkHorInnerLine.cloneNode(true);
        startLine.append(innerHorLine);
        taskLink.append(startLine);

        middleLine.style.left = `${
          startLine.offsetLeft + startLine.offsetWidth
        }px`;
        middleLine.style.top = `${
          Math.min(sourceTop, targetTop) + rowHeight / 2
        }px`;
        middleLine.style.height = `${Math.abs(sourceTop - targetTop) + 2}px`;
        let innerLine = linkVerInnerLine.cloneNode(true);
        middleLine.append(innerLine);
        taskLink.append(middleLine);

        endLine.style.left = `${targetLeft + targetWidth}px`;
        endLine.style.top = `${targetTop + rowHeight / 2}px`;
        endLine.style.width = `${
          Math.abs(targetLeft + targetWidth - middleLine.offsetLeft) + 2
        }px`;
        let innerEndHorLine = linkHorInnerLine.cloneNode(true);
        endLine.append(innerEndHorLine);
        taskLink.append(endLine);
      } else if (linkType == 3) {
        if (sourceLeft > targetLeft + targetWidth) {
          startLine.style.left = `${targetLeft + targetWidth + 15}px`;
          startLine.style.width = `${
            sourceLeft - (targetLeft + targetWidth) - 15
          }px`;
        } else {
          startLine.style.left = `${sourceLeft - 15}px`;
          startLine.style.width = `${15}px`;
        }
        startLine.style.top = `${sourceTop + rowHeight / 2}px`;
        let innerHorLine = linkHorInnerLine.cloneNode(true);
        startLine.append(innerHorLine);
        taskLink.append(startLine);

        if (sourceLeft <= targetLeft + targetWidth) {
          let middleLine = document.createElement("div");
          middleLine.classList.add(
            "zt-gantt-ver-link-line",
            "zt-gantt-link-line"
          );
          middleLine.style.left = `${startLine.offsetLeft}px`;
          if (sourceTop < targetTop) {
            middleLine.style.top = `${
              Math.min(sourceTop, targetTop) + rowHeight / 2
            }px`;
            middleLine.style.height = `${
              source.offsetHeight / 2 + (extraHeight + 2)
            }px`;
          } else {
            middleLine.style.top = `${
              Math.min(sourceTop, targetTop) + rowHeight + (extraHeight + 2)
            }px`;
            middleLine.style.height = `${
              Math.abs(sourceTop - targetTop) - rowHeight / 2 - extraHeight
            }px`;
          }
          let innerLine = linkVerInnerLine.cloneNode(true);
          middleLine.append(innerLine);
          taskLink.append(middleLine);

          let horLine = document.createElement("div");
          horLine.classList.add("zt-gantt-hor-link-line", "zt-gantt-link-line");
          horLine.style.left = `${startLine.offsetLeft}px`;
          horLine.style.top = `${
            Math.min(sourceTop, targetTop) + source.offsetHeight + extraHeight
          }px`;
          horLine.style.width = `${
            Math.abs(targetLeft + targetWidth - startLine.offsetLeft) + 15
          }px`;
          let innerHorLine = linkHorInnerLine.cloneNode(true);
          horLine.append(innerHorLine);
          taskLink.append(horLine);
        }

        middleLine.style.left = `${targetLeft + targetWidth + 15}px`;
        if (sourceTop < targetTop) {
          if (sourceLeft > targetLeft + targetWidth) {
            middleLine.style.top = `${
              Math.min(sourceTop, targetTop) + rowHeight / 2
            }px`;
            middleLine.style.height = `${
              Math.abs(sourceTop - targetTop) + 2
            }px`;
          } else {
            middleLine.style.top = `${
              Math.min(sourceTop, targetTop) + rowHeight + extraHeight
            }px`;
            middleLine.style.height = `${
              Math.abs(sourceTop - targetTop) - rowHeight / 2 - extraHeight + 2
            }px`;
          }
        } else {
          middleLine.style.top = `${
            Math.min(sourceTop, targetTop) + rowHeight / 2
          }px`;
          if (sourceLeft > targetLeft + targetWidth) {
            middleLine.style.height = `${Math.abs(sourceTop - targetTop)}px`;
          } else {
            middleLine.style.height = `${
              source.offsetHeight / 2 + (extraHeight + 2)
            }px`;
          }
        }
        let innerLine = linkVerInnerLine.cloneNode(true);
        middleLine.append(innerLine);
        taskLink.append(middleLine);

        endLine.style.left = `${targetLeft + targetWidth}px`;
        endLine.style.top = `${targetTop + rowHeight / 2}px`;
        endLine.style.width = `${15}px`;
        let innerEndLine = linkHorInnerLine.cloneNode(true);
        endLine.append(innerEndLine);
        taskLink.append(endLine);
      }

      // call updateLinkPosition function onTaskDrag
      this.attachEvent("onTaskDrag", (e) => {
        this.updateLinkPosition(source, target, taskLink, rowHeight, link);
      });

      // call updateLinkPosition function onAfterTaskDrag
      this.attachEvent("onAfterTaskDrag", (e) => {
        this.updateLinkPosition(source, target, taskLink, rowHeight, link);
      });

      // call updateLinkPosition function onAutoScheduling
      this.attachEvent("onAutoScheduling", (e) => {
        this.updateLinkPosition(source, target, taskLink, rowHeight, link);
      });
    },

    // function to update the position of the links
    updateLinkPosition: function (source, target, link, rowHeight, linkObj) {
      let sourceLeft = source.offsetLeft,
        sourceWidth = source.offsetWidth,
        sourceTop = source.offsetTop,
        targetLeft = target.offsetLeft,
        targetWidth = target.offsetWidth,
        targetTop = target.offsetTop,
        extraHeight =
          (this.options.row_height -
            Math.floor((this.options.row_height * 80) / 100)) /
            2 -
          1;

      let taskLink = document.createElement("div");
      taskLink.setAttribute("link-id", linkObj.id);
      taskLink.classList.add("zt-gantt-task-link");

      let startLine = document.createElement("div");
      startLine.classList.add("zt-gantt-hor-link-line", "zt-gantt-link-line");

      let middleLine = document.createElement("div");
      middleLine.classList.add("zt-gantt-ver-link-line", "zt-gantt-link-line");

      let endLine = document.createElement("div");
      endLine.classList.add("zt-gantt-hor-link-line", "zt-gantt-link-line");

      let linkVerInnerLine = document.createElement("div");
      linkVerInnerLine.classList.add("ver-inner-line");

      let linkHorInnerLine = document.createElement("div");
      linkHorInnerLine.classList.add("hor-inner-line");

      let linkType = linkObj.type || 0;

      if (linkType === 0) {
        startLine.style.left = sourceLeft + sourceWidth + "px";
        startLine.style.top = sourceTop + rowHeight / 2 + "px";
        startLine.style.width = 15 + "px";
        let innerHorLine = linkHorInnerLine.cloneNode(true);
        startLine.append(innerHorLine);
        taskLink.append(startLine);

        if (sourceLeft + sourceWidth + 15 >= targetLeft) {
          let middleLine = document.createElement("div");
          middleLine.classList.add(
            "zt-gantt-ver-link-line",
            "zt-gantt-link-line"
          );
          middleLine.style.left = sourceLeft + sourceWidth + 15 + "px";
          if (sourceTop < targetTop) {
            middleLine.style.top =
              Math.min(sourceTop, targetTop) + rowHeight / 2 + "px";
            middleLine.style.height =
              source.offsetHeight / 2 + (extraHeight + 2) + "px";
          } else {
            if (Math.abs(sourceTop - targetTop) <= rowHeight / 2) {
              middleLine.style.top =
                Math.min(sourceTop, targetTop) +
                rowHeight / 2 +
                Math.abs(sourceTop - targetTop) +
                "px";
              middleLine.style.height =
                Math.abs(
                  sourceTop - targetTop - rowHeight / 2 - (extraHeight + 2)
                ) + "px";
            } else {
              middleLine.style.top =
                Math.min(sourceTop, targetTop) + rowHeight + extraHeight + "px";
              middleLine.style.height =
                Math.abs(sourceTop - targetTop) - rowHeight / 2 + 1 + "px";
            }
          }
          let innerLine = linkVerInnerLine.cloneNode(true);
          middleLine.append(innerLine);
          taskLink.append(middleLine);

          let horLine = document.createElement("div");
          horLine.classList.add("zt-gantt-hor-link-line", "zt-gantt-link-line");
          horLine.style.left = targetLeft - 15 + "px";
          horLine.style.top =
            Math.min(sourceTop, targetTop) +
            source.offsetHeight +
            extraHeight +
            "px";
          if (0 < sourceLeft + sourceWidth + 15 - targetLeft <= 15) {
            horLine.style.width =
              Math.abs(sourceLeft + sourceWidth + 15 - targetLeft) + 15 + "px";
          } else {
            horLine.style.width =
              Math.abs(sourceLeft + sourceWidth - targetLeft) + 30 + "px";
          }
          let innerHorLine = linkHorInnerLine.cloneNode(true);
          horLine.append(innerHorLine);
          taskLink.append(horLine);
        }

        if (sourceLeft + sourceWidth + 15 >= targetLeft) {
          middleLine.style.left = target.offsetLeft - 15 + "px";
          if (sourceTop < targetTop) {
            if (Math.abs(sourceTop - targetTop) <= rowHeight / 2) {
              middleLine.style.top =
                Math.min(sourceTop, targetTop) +
                rowHeight / 2 +
                Math.abs(sourceTop - targetTop) +
                "px";
              middleLine.style.height =
                Math.abs(sourceTop - targetTop + rowHeight / 2 + extraHeight) +
                "px";
            } else {
              middleLine.style.top =
                Math.min(sourceTop, targetTop) +
                rowHeight +
                (extraHeight + 2) +
                "px";
              middleLine.style.height =
                Math.abs(sourceTop - targetTop) -
                rowHeight / 2 -
                extraHeight +
                "px";
            }
          } else {
            middleLine.style.top =
              Math.min(sourceTop, targetTop) + rowHeight / 2 + "px";
            middleLine.style.height =
              source.offsetHeight / 2 + extraHeight + "px";
          }
        } else {
          middleLine.style.left = sourceLeft + sourceWidth + 13 + "px";
          middleLine.style.top =
            Math.min(sourceTop, targetTop) + rowHeight / 2 + 2 + "px";
          middleLine.style.height = Math.abs(sourceTop - targetTop) + "px";
        }
        let innerLine = linkVerInnerLine.cloneNode(true);
        middleLine.append(innerLine);
        taskLink.append(middleLine);

        if (sourceLeft + sourceWidth + 15 >= targetLeft) {
          endLine.style.left = targetLeft - 15 + "px";
          endLine.style.top = targetTop + rowHeight / 2 + "px";
          endLine.style.width = 15 + "px";
        } else {
          endLine.style.left = sourceLeft + sourceWidth + 13 + "px";
          endLine.style.top = targetTop + rowHeight / 2 + "px";
          endLine.style.width =
            Math.abs(sourceLeft + sourceWidth + 15 - targetLeft) + "px";
        }
        let innerEndLine = linkHorInnerLine.cloneNode(true);
        endLine.append(innerEndLine);
        taskLink.append(endLine);
      } else if (linkType === 1) {
        startLine.style.left = Math.min(sourceLeft, targetLeft) - 15 + "px";
        startLine.style.top = sourceTop + rowHeight / 2 + "px";
        if (sourceLeft > targetLeft) {
          startLine.style.width = Math.abs(sourceLeft - targetLeft) + 15 + "px";
        } else {
          startLine.style.width = 15 + "px";
        }
        let innerHorLine = linkHorInnerLine.cloneNode(true);
        startLine.append(innerHorLine);
        taskLink.append(startLine);

        if (sourceLeft >= targetLeft) {
          middleLine.style.left = targetLeft - 15 + "px";
          middleLine.style.top =
            Math.min(sourceTop, targetTop) + rowHeight / 2 + "px";
          middleLine.style.height = Math.abs(sourceTop - targetTop) + "px";
        } else {
          middleLine.style.left = Math.min(sourceLeft, targetLeft) - 15 + "px";
          middleLine.style.top =
            Math.min(sourceTop, targetTop) + rowHeight / 2 + "px";
          middleLine.style.height = Math.abs(sourceTop - targetTop) + "px";
        }
        let innerLine = linkVerInnerLine.cloneNode(true);
        middleLine.append(innerLine);
        taskLink.append(middleLine);

        endLine.style.left = `${Math.min(targetLeft, sourceLeft) - 15}px`;
        endLine.style.top = `${targetTop + rowHeight / 2}px`;
        endLine.style.width = `${
          targetLeft - (Math.min(targetLeft, sourceLeft) - 15)
        }px`;
        let innerEndLine = linkHorInnerLine.cloneNode(true);
        endLine.append(innerEndLine);
        taskLink.append(endLine);
      } else if (linkType === 2) {
        startLine.style.left = `${sourceLeft + sourceWidth}px`;
        startLine.style.top = `${sourceTop + rowHeight / 2}px`;
        if (sourceLeft + sourceWidth < targetLeft + targetWidth) {
          startLine.style.width = `${
            Math.abs(sourceLeft + sourceWidth - (targetLeft + targetWidth)) + 15
          }px`;
        } else {
          startLine.style.width = `${15}px`;
        }
        let innerHorLine = linkHorInnerLine.cloneNode(true);
        startLine.append(innerHorLine);
        taskLink.append(startLine);

        middleLine.style.left = `${
          Math.max(targetLeft + targetWidth, sourceLeft + sourceWidth) + 15
        }px`;
        middleLine.style.top = `${
          Math.min(sourceTop, targetTop) + rowHeight / 2
        }px`;
        middleLine.style.height = `${Math.abs(sourceTop - targetTop) + 2}px`;
        let innerLine = linkVerInnerLine.cloneNode(true);
        middleLine.append(innerLine);
        taskLink.append(middleLine);

        endLine.style.left = `${targetLeft + targetWidth}px`;
        endLine.style.top = `${targetTop + rowHeight / 2}px`;
        if (sourceLeft + sourceWidth < targetLeft + targetWidth) {
          endLine.style.width = `${15}px`;
        } else {
          endLine.style.width = `${
            Math.abs(targetLeft + targetWidth - (sourceLeft + sourceWidth)) + 15
          }px`;
        }
        let innerEndLine = linkHorInnerLine.cloneNode(true);
        endLine.append(innerEndLine);
        taskLink.append(endLine);
      } else if (linkType === 3) {
        startLine.style.top = `${sourceTop + rowHeight / 2}px`;
        if (sourceLeft > targetLeft + targetWidth + 30) {
          startLine.style.left = `${targetLeft + targetWidth + 15}px`;
          startLine.style.width = `${
            sourceLeft - (targetLeft + targetWidth) - 15
          }px`;
        } else {
          startLine.style.left = `${sourceLeft - 15}px`;
          startLine.style.width = `${15}px`;
        }
        let innerHorLine = linkHorInnerLine.cloneNode(true);
        startLine.append(innerHorLine);
        taskLink.append(startLine);

        if (sourceLeft - 30 < targetLeft + targetWidth) {
          let middleLine = document.createElement("div");
          middleLine.classList.add(
            "zt-gantt-ver-link-line",
            "zt-gantt-link-line"
          );
          middleLine.style.left = `${sourceLeft - 15}px`;
          if (sourceTop < targetTop) {
            middleLine.style.top = `${
              Math.min(sourceTop, targetTop) + rowHeight / 2
            }px`;
            middleLine.style.height = `${
              source.offsetHeight / 2 + (extraHeight + 2)
            }px`;
          } else {
            if (Math.abs(sourceTop - targetTop) <= rowHeight / 2) {
              middleLine.style.top =
                Math.min(sourceTop, targetTop) +
                rowHeight / 2 +
                Math.abs(sourceTop - targetTop) +
                "px";
              middleLine.style.height =
                Math.abs(
                  sourceTop - targetTop - rowHeight / 2 - (extraHeight + 2)
                ) + "px";
            } else {
              middleLine.style.top = `${
                Math.min(sourceTop, targetTop) + rowHeight + (extraHeight + 2)
              }px`;
              middleLine.style.height = `${
                Math.abs(sourceTop - targetTop) - rowHeight / 2 - extraHeight
              }px`;
            }
          }
          let innerLine = linkVerInnerLine.cloneNode(true);
          middleLine.append(innerLine);
          taskLink.append(middleLine);

          let horLine = document.createElement("div");
          horLine.classList.add("zt-gantt-hor-link-line", "zt-gantt-link-line");
          horLine.style.left = `${sourceLeft - 15}px`;
          horLine.style.top = `${
            Math.min(sourceTop, targetTop) + source.offsetHeight + extraHeight
          }px`;
          if (sourceLeft > targetLeft + targetWidth) {
            horLine.style.width = `${Math.abs(
              targetLeft + targetWidth + 15 - (sourceLeft - 15)
            )}px`;
          } else {
            horLine.style.width = `${
              Math.abs(targetLeft + targetWidth - sourceLeft) + 30
            }px`;
          }
          let innerHorLine = linkHorInnerLine.cloneNode(true);
          horLine.append(innerHorLine);
          taskLink.append(horLine);
        }

        middleLine.style.left = `${targetLeft + targetWidth + 15}px`;
        if (sourceTop < targetTop) {
          if (sourceLeft - 15 >= targetLeft + targetWidth + 15) {
            middleLine.style.top = `${
              Math.min(sourceTop, targetTop) + rowHeight / 2 + 2
            }px`;
            middleLine.style.height = `${Math.abs(sourceTop - targetTop)}px`;
          } else {
            if (Math.abs(sourceTop - targetTop) <= rowHeight / 2) {
              middleLine.style.top =
                Math.min(sourceTop, targetTop) +
                rowHeight / 2 +
                Math.abs(sourceTop - targetTop) +
                "px";
              middleLine.style.height =
                Math.abs(
                  sourceTop - targetTop + rowHeight / 2 + extraHeight + 2
                ) + "px";
            } else {
              middleLine.style.top = `${
                Math.min(sourceTop, targetTop) + rowHeight + extraHeight
              }px`;
              middleLine.style.height = `${
                Math.abs(sourceTop - targetTop) -
                rowHeight / 2 -
                extraHeight +
                2
              }px`;
            }
          }
        } else {
          middleLine.style.top = `${
            Math.min(sourceTop, targetTop) + rowHeight / 2
          }px`;
          if (sourceLeft - 15 >= targetLeft + targetWidth + 15) {
            middleLine.style.height = `${Math.abs(sourceTop - targetTop)}px`;
          } else {
            middleLine.style.height = `${
              source.offsetHeight / 2 + (extraHeight + 2)
            }px`;
          }
        }
        let innerLine = linkVerInnerLine.cloneNode(true);
        middleLine.append(innerLine);
        taskLink.append(middleLine);

        endLine.style.left = `${targetLeft + targetWidth}px`;
        endLine.style.top = `${targetTop + rowHeight / 2}px`;
        endLine.style.width = `${15}px`;
        let innerEndLine = linkHorInnerLine.cloneNode(true);
        endLine.append(innerEndLine);
        taskLink.append(endLine);
      }
      link.innerHTML = taskLink.innerHTML;
    },

    // function to delete link
    deleteLink: function (id) {
      let link = document.querySelector(`[link-id="${id}"]`);
      if (link !== undefined && link !== null) {
        let linkobj;
        link.remove();
        let linkIndex = this.options.links.findIndex((obj) => obj.id == id);
        linkobj = this.options.links.filter((obj) => obj.id == id);
        this.options.links.splice(linkIndex, 1);
        const onDeleteLink = new CustomEvent("onDeleteLink", {
          detail: {
            link: linkobj,
          },
        });
        this.element.dispatchEvent(onDeleteLink);
      }
    },

    // function to create new link
    createNewLink: function (linkPoint, source, sourceId, type) {
      let strech = false,
        startX,
        startY,
        targetId,
        targetType,
        that = this,
        autoScroll = false,
        rightPanelScroll,
        barsArea;

      linkPoint.removeEventListener("mousedown", handleMouseDown);
      linkPoint.addEventListener("mousedown", handleMouseDown);

      function handleMouseDown(e) {
        rightPanelScroll = document.getElementById("zt-gantt-right-cell");
        barsArea = document.getElementById("zt-gantt-bars-area");
        startX = e.clientX + rightPanelScroll.scrollLeft;
        startY = e.clientY + rightPanelScroll.scrollTop;

        barsArea.classList.add("zt-gantt-link-streching");
        source.classList.add("source");

        document.addEventListener("mousemove", strechLink, false);
        document.addEventListener("mouseup", handleMouseUp, false);
      }

      function handleMouseUp(e) {
        autoScroll = false;
        document.removeEventListener("mousemove", strechLink, false);
        document.removeEventListener("mouseup", handleMouseUp, false);
        let selectedTarget = document.querySelector(".selected-target");
        if (selectedTarget !== undefined && selectedTarget !== null) {
          selectedTarget.classList.remove("selected-target");
        }
        barsArea.classList.remove("zt-gantt-link-streching");
        source.classList.remove("source");
        if (strech) {
          document.querySelector(".zt-gantt-link-direction").remove();
          let linkType =
            type === "left" && targetType === "left"
              ? 1
              : type === "right" && targetType === "right"
              ? 2
              : type === "left" && targetType === "right"
              ? 3
              : 0;
          let isLinkExist = that.options.links.find(
            (obj) =>
              obj.source == sourceId &&
              obj.target == targetId &&
              obj.type == linkType
          );

          targetId =
            isNaN(targetId) || targetId === null ? targetId : +targetId;

          let hasCycle = that.hasCycle(sourceId, targetId);

          // handle custom event
          const onBeforeLinkAdd = new CustomEvent("onBeforeLinkAdd", {
            detail: {
              sourceId: sourceId,
              targetId: targetId,
              type: linkType,
            },
          });
          that.element.dispatchEvent(onBeforeLinkAdd);

          if (that.eventValue === false) {
            that.eventValue = true;
            return;
          }

          if (
            targetId !== undefined &&
            targetId !== null &&
            targetId != sourceId &&
            isLinkExist == undefined &&
            isLinkExist == null &&
            !hasCycle
          ) {
            link = {
              id: `${linkType}-${sourceId}-${targetId}`,
              source: sourceId,
              target: targetId,
              type: linkType,
            };
            that.createLinks(sourceId, targetId, link);
            that.options.links.push(link);

            // handle custom event
            const onLinkAdd = new CustomEvent("onLinkAdd", {
              detail: {
                link: link,
              },
            });
            that.element.dispatchEvent(onLinkAdd);
          }
        }
        strech = false;
      }

      function strechLink(e) {
        strech = true;

        let linkDirection;
        let isLinkDirectionExist = document.querySelector(
          ".zt-gantt-link-direction"
        );
        let linksArea = document.querySelector("#zt-gantt-links-area");
        if (!isLinkDirectionExist) {
          linkDirection = document.createElement("div");
          linkDirection.classList.add("zt-gantt-link-direction");
          linksArea.append(linkDirection);
        } else {
          linkDirection = isLinkDirectionExist;
        }

        linkDirection.style.left =
          (type === "right"
            ? source.offsetLeft + source.offsetWidth
            : source.offsetLeft) + "px";
        linkDirection.style.top =
          source.offsetTop + source.offsetHeight / 2 + "px";
        let base = Math.abs(
          e.clientX -
            (startX -
              (type === "left" && e.clientX - startX > 0
                ? -20
                : type === "left" && e.clientX - startX < 0
                ? 0
                : e.clientX - startX > 0
                ? 0
                : 20) -
              rightPanelScroll.scrollLeft)
        );
        let perp = Math.abs(e.clientY - (startY - rightPanelScroll.scrollTop));
        let hypo = Math.sqrt(base * base + perp * perp);
        linkDirection.style.width = hypo + "px";

        let scrollSpeed = 5;

        function startAutoScroll(type) {
          if (type === "right") {
            rightPanelScroll.scrollLeft += scrollSpeed;
            if (
              rightPanelScroll.scrollLeft >=
              rightPanelScroll.scrollWidth - rightPanelScroll.clientWidth
            ) {
              autoScroll = false;
              return;
            }
          } else if (type === "left") {
            rightPanelScroll.scrollLeft -= scrollSpeed;
            if (rightPanelScroll.scrollLeft <= 0) {
              autoScroll = false;
              return;
            }
          } else if (type === "top") {
            rightPanelScroll.scrollTop += scrollSpeed;
            if (rightPanelScroll.scrollTop <= 0) {
              autoScroll = false;
              return;
            }
          } else if (type === "bottom") {
            rightPanelScroll.scrollTop -= scrollSpeed;
            if (
              rightPanelScroll.scrollTop >=
              rightPanelScroll.scrollHeight - rightPanelScroll.clientHeight
            ) {
              autoScroll = false;
              return;
            }
          }
          if (autoScroll) {
            setTimeout(() => {
              startAutoScroll(type);
            }, 50); // Adjust the scroll delay by changing the value here
          }
        }

        const scrollContainer =
          that.element.offsetLeft + rightPanelScroll.offsetLeft;
        const scrollThresholdRight =
          scrollContainer + rightPanelScroll.offsetWidth - 30;
        const scrollThresholdLeft = scrollContainer + 30;

        // auto scroll the div left and right
        if (e.clientX > scrollThresholdRight - window.scrollX) {
          autoScroll = true;
          startAutoScroll("right");
        } else if (e.clientX < scrollThresholdLeft - window.scrollX) {
          autoScroll = true;
          startAutoScroll("left");
        } else {
          autoScroll = false;
        }

        const scrollContainerTop =
          that.element.offsetTop + rightPanelScroll.offsetHeight;
        const scrollThresholdTop = scrollContainerTop - 30;
        const scrollThresholdBottom =
          that.element.offsetTop +
          that.calculateScaleHeight(
            that.options.scales,
            that.options.scale_height,
            "scroll",
            0
          ) +
          30;

        // auto scroll the div top and bottom
        if (e.clientY > scrollThresholdTop - window.scrollY) {
          autoScroll = true;
          startAutoScroll("top");
        } else if (e.clientY < scrollThresholdBottom - window.scrollY) {
          autoScroll = true;
          startAutoScroll("bottom");
        }

        // Retrieve the mouse coordinates from the event
        var mouseX = e.pageX;
        var mouseY = e.pageY;

        // Calculate the differences between the mouse coordinates and the point coordinates
        var deltaX =
          mouseX -
          (startX - (type === "left" ? -20 : 20) - rightPanelScroll.scrollLeft);
        var deltaY = mouseY - (startY - rightPanelScroll.scrollTop);

        // Calculate the angle in radians
        var radians = Math.atan2(deltaY, deltaX);
        linkDirection.style.transform = `rotate(${radians}rad)`;
        if (e.target.classList.contains("zt-gantt-link-point")) {
          targetId = e.target.parentElement.parentElement.getAttribute(
            "zt-gantt-taskbar-id"
          );
          targetType = e.target.parentElement.classList.contains(
            "zt-gantt-left-point"
          )
            ? "left"
            : "right";
          if (targetId != sourceId) {
            e.target.classList.add("selected-target");
          }
        } else {
          targetId = null;
          targetType = undefined;
          let selectedTarget = document.querySelector(".selected-target");
          if (selectedTarget !== undefined && selectedTarget !== null) {
            selectedTarget.classList.remove("selected-target");
          }
        }
      }
    },

    // function to show loader
    showLoader: function () {
      const ztLoader = document.createElement("span");
      const ztLoaderDrop = document.createElement("div");

      ztLoader.id = "zt-gantt-loader";
      ztLoader.classList.add("zt-gantt-loader");
      ztLoaderDrop.classList.add("zt-gantt-loader-drop");

      document.body.append(ztLoaderDrop, ztLoader);
    },

    // function to hide loader
    hideLoader: function () {
      const ztLoader = document.querySelector("#zt-gantt-loader");
      const ztLoaderDrop = document.querySelector(".zt-gantt-loader-drop");

      if (ztLoader) {
        ztLoader.remove();
      }

      if (ztLoaderDrop) {
        ztLoaderDrop.remove();
      }
    },

    // function to initialize zoom options
    zoomInit: function (type = "after") {
      let zoomLevels = this.options.zoomConfig;
      for (levels of zoomLevels.levels) {
        if (this.options.zoomLevel == levels.name) {
          this.options.scale_height =
            levels.scale_height || this.options.scale_height;
          this.options.minColWidth =
            levels.min_col_width || this.options.minColWidth;
          this.options.scales = levels.scales;
          break;
        }
      }

      if (type !== "initial") {
        // this.dates = this.getDates(this.options.startDate, this.options.endDate);
        // this.updateBody();
        this.render();

        sidebarDataHead = document.querySelector(
          ".sidebar-head-cell-container"
        );

        let containerHeight = this.calculateScaleHeight(
          this.options.scales,
          this.options.scale_height,
          "header",
          0
        );
        sidebarDataHead.style.height = containerHeight;
        sidebarDataHead.style.lineHeight = containerHeight;
      }
    },

    // function to get the number of days in  a month of a date
    getDaysInMonth: function (dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth();

      const daysInMonth = new Date(year, month + 1, 0).getDate();

      return daysInMonth;
    },

    // function to get the days in quarter of a date
    getDaysInQuarter: function (dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth();

      const quarterStartMonth = Math.floor(month / 3) * 3;
      const quarterStartDate = new Date(year, quarterStartMonth, 1);
      const quarterEndDate = new Date(year, quarterStartMonth + 3, 0);

      const daysInQuarter =
        (quarterEndDate - quarterStartDate) / (1000 * 60 * 60 * 24) + 1;

      return daysInQuarter;
    },

    // function to get the quarter of a date
    getQuarterOfDate: function (date) {
      date = new Date(date);
      // Get the month from the date (0-11)
      const month = date.getMonth();
      // Calculate the quarter
      const quarter = Math.floor(month / 3) + 1;
      return quarter;
    },

    // function to get the current zoom level scale
    getScale: function () {
      let scaleObj = {
        unit: this.options.zoomLevel,
        step: 1,
        startDate: this.options.startDate,
        endDate: this.options.endDate,
      };
      return scaleObj;
    },

    addTaskOnDrag: function (timeLine) {
      let startX,
        taskBarArea,
        hasMoved = false,
        taskArea,
        taskStartDate,
        taskEndDate,
        that = this,
        taskParent,
        end_date,
        timeLineContainer,
        autoScroll = false,
        scrollSpeed = 5;

      timeLine.removeEventListener("mousedown", handleMouseDown);
      timeLine.addEventListener("mousedown", handleMouseDown);

      function handleMouseDown(e) {
        taskBarArea = document.querySelector("#zt-gantt-bars-area");
        timeLineContainer = document.querySelector("#zt-gantt-right-cell");
        startX =
          e.clientX + timeLineContainer.scrollLeft - that.element.offsetLeft;
        var classesToCheck = ["zt-gantt-task-row", "zt-gantt-task-cell"];

        var isClassPresent = false;
        for (var i = 0; i < classesToCheck.length; i++) {
          if (e.target.classList.contains(classesToCheck[i])) {
            isClassPresent = true;
            break;
          }
        }
        if (isClassPresent === false) {
          return;
        }

        let taskAreaRow;
        if (e.target.classList.contains("zt-gantt-task-row")) {
          taskAreaRow = e.target;
        } else {
          taskAreaRow = e.target.parentElement;
        }

        taskArea = document.createElement("div");
        taskArea.id = "task-area";
        taskArea.classList.add("task-area");
        taskArea.style.top = `${taskAreaRow.offsetTop}px`;
        taskArea.style.left = `${
          e.clientX - timeLine.offsetLeft + timeLineContainer.scrollLeft
        }px`;
        taskArea.style.height = `${taskAreaRow.offsetHeight}px`;

        let allTaskBars = taskBarArea.querySelectorAll(".zt-gantt-bar-task");
        taskParent = allTaskBars[
          Math.floor(taskAreaRow.offsetTop / taskAreaRow.offsetHeight)
        ].getAttribute("zt-gantt-taskbar-id");
        let parentTask = that.getTask(taskParent);
        if (parentTask.hasOwnProperty("end_date")) {
          end_date = parentTask.start_date;
        }
        if (parentTask.children && parentTask.children.length) {
          end_date = that.getStartAndEndDate(parentTask.children).endDate;
        }

        document.addEventListener("mousemove", createTaskArea, false);
        document.addEventListener("mouseup", handleMouseUp, false);
      }

      function handleMouseUp(e) {
        document.removeEventListener("mousemove", createTaskArea, false);
        document.removeEventListener("mouseup", handleMouseUp, false);
        if (startX === e.clientX) {
          hasMoved = false;
          return;
        }
        if (hasMoved === true) {
          taskStartDate =
            that.dates[
              Math.floor(
                (taskArea.offsetLeft < 0 ? 0 : taskArea.offsetLeft) /
                  that.calculateGridWidth(end_date, "day")
              )
            ];

          let isAtLastCol =
            that.calculateTimeLineWidth("current") <
            taskArea.offsetLeft + taskArea.offsetWidth;
          let dateIndex;
          if (!isAtLastCol) {
            dateIndex = Math.floor(
              (taskArea.offsetLeft + taskArea.offsetWidth) /
                that.calculateGridWidth(end_date, "day")
            );
          } else {
            dateIndex = that.dates.length - 1;
          }
          taskEndDate = that.dates[dateIndex];

          if (taskArea) {
            taskArea.remove();
          }
          let task = {
            startDate: new Date(taskStartDate),
            endDate: new Date(taskEndDate),
            parent: isNaN(taskParent) ? taskParent : +taskParent,
          };
          // handle custom event
          const addTaskOnDrag = new CustomEvent("addTaskOnDrag", {
            detail: {
              task: task,
            },
          });
          that.element.dispatchEvent(addTaskOnDrag);
        }
        hasMoved = false;
      }
      function createTaskArea(e) {
        hasMoved = true;

        if (
          e.clientX + timeLineContainer.scrollLeft - that.element.offsetLeft <
          startX
        ) {
          taskArea.style.left = `${
            e.clientX -
            timeLine.offsetLeft +
            timeLineContainer.scrollLeft -
            that.element.offsetLeft
          }px`;
          taskArea.style.width = `${
            startX -
            (e.clientX - that.element.offsetLeft) -
            timeLineContainer.scrollLeft
          }px`;
        } else {
          taskArea.style.left = `${startX - timeLine.offsetLeft}px`;
          taskArea.style.width = `${
            e.clientX -
            startX +
            timeLineContainer.scrollLeft -
            that.element.offsetLeft
          }px`;
        }
        let isTaskAreaExist = document.querySelector("#task-area");
        if (!isTaskAreaExist) {
          if (startX !== e.clientX) {
            taskBarArea.append(taskArea);
          }
        }

        function startAutoScroll(type) {
          if (type === "right") {
            timeLineContainer.scrollLeft += scrollSpeed;
            if (
              timeLineContainer.scrollLeft >=
              timeLineContainer.scrollWidth - timeLineContainer.clientWidth
            ) {
              autoScroll = false;
              return;
            }
          } else if (type === "left") {
            timeLineContainer.scrollLeft -= scrollSpeed;
            if (timeLineContainer.scrollLeft <= 0) {
              autoScroll = false;
              return;
            }
          }
          if (autoScroll) {
            setTimeout(() => {
              startAutoScroll(type);
            }, 50); // Adjust the scroll delay by changing the value here
          }
        }

        const scrollContainer =
          that.element.offsetLeft + timeLineContainer.offsetLeft;
        const scrollThresholdRight =
          scrollContainer + timeLineContainer.offsetWidth - 30;
        const scrollThresholdLeft = scrollContainer + 30;

        // auto scroll the div left and right
        if (e.clientX > scrollThresholdRight - window.scrollX) {
          autoScroll = true;
          startAutoScroll("right");
        } else if (e.clientX < scrollThresholdLeft - window.scrollX) {
          autoScroll = true;
          startAutoScroll("left");
        } else {
          autoScroll = false;
        }
      }
    },

    dragTaskProgress: function (resizer, progress, taskBar, task) {
      let startX,
        dragging = false,
        that = this,
        autoScroll = false,
        timeLineContainer,
        scrollSpeed = 5,
        startProgressWidth;

      resizer.removeEventListener("mousedown", handleMouseDown);
      resizer.addEventListener("mousedown", handleMouseDown);

      function handleMouseDown(e) {
        startProgressWidth = progress.offsetWidth;
        timeLineContainer = document.querySelector("#zt-gantt-right-cell");
        startX = e.clientX + timeLineContainer.scrollLeft;

        document.addEventListener("mousemove", resize, false);
        document.addEventListener("mouseup", handleMouseUp, false);
      }

      function handleMouseUp(e) {
        document.removeEventListener("mousemove", resize, false);
        document.removeEventListener("mouseup", handleMouseUp, false);
        if (dragging === true) {
          let progressPer = Math.round(
            (progress.offsetWidth / taskBar.offsetWidth) * 100
          );
          progress.style.width = `${progressPer}%`;
          resizer.style.left = `${progressPer}%`;

          task.progress = progressPer;
          that.originalData.findIndex((item) => {
            if (item.id == task.id) {
              item.progress = progressPer;
            }
          });
          // handle custom event
          const onAfterProgressDrag = new CustomEvent("onAfterProgressDrag", {
            detail: {
              task: task,
            },
          });
          that.element.dispatchEvent(onAfterProgressDrag);
        }
        dragging = false;
      }

      function resize(e) {
        const onBeforeProgressDrag = new CustomEvent("onBeforeProgressDrag", {
          detail: {
            task: task,
          },
        });
        that.element.dispatchEvent(onBeforeProgressDrag);

        // if onBeforeProgressDrag return false then do not drag the Progress
        if (that.eventValue === false) {
          return;
        }

        dragging = true;
        let progressWidth =
          startProgressWidth +
          (e.clientX - startX) +
          timeLineContainer.scrollLeft;
        if (progressWidth > taskBar.offsetWidth || progressWidth < 0) {
          return;
        }
        progress.style.width = `${progressWidth}px`;
        resizer.style.left = `${progressWidth}px`;

        // function for auto scroll
        function startAutoScroll(type) {
          if (type === "right") {
            timeLineContainer.scrollLeft += scrollSpeed;
            if (
              timeLineContainer.scrollLeft >=
              timeLineContainer.scrollWidth - timeLineContainer.clientWidth
            ) {
              autoScroll = false;
              return;
            }
          } else if (type === "left") {
            timeLineContainer.scrollLeft -= scrollSpeed;
            if (timeLineContainer.scrollLeft <= 0) {
              autoScroll = false;
              return;
            }
          }
          if (autoScroll) {
            setTimeout(() => {
              startAutoScroll(type);
            }, 50);
          }
        }

        const scrollContainer =
          that.element.offsetLeft + timeLineContainer.offsetLeft;
        const scrollThresholdRight =
          scrollContainer + timeLineContainer.offsetWidth - 30;
        const scrollThresholdLeft = scrollContainer + 30;

        // auto scroll the div left and right
        if (e.clientX > scrollThresholdRight - window.scrollX) {
          autoScroll = true;
          startAutoScroll("right");
        } else if (e.clientX < scrollThresholdLeft - window.scrollX) {
          autoScroll = true;
          startAutoScroll("left");
        } else {
          autoScroll = false;
        }
      }
    },

    // function to update Body
    updateBody: function () {
      this.verScroll =
        document.querySelector(".zt-gantt-ver-scroll")?.scrollTop || 0;
      this.horScroll =
        document.querySelector(".zt-gantt-hor-scroll")?.scrollLeft || 0;

      let calendar = document.getElementById("zt-gantt-right-cell");
      let mainContainer = document.querySelector(".zt-gantt-layout");
      calendar.innerHTML = "";
      this.createHeaderScale(this.dates, calendar, this.options);
      this.createBody(
        this.options,
        this.dates,
        calendar,
        mainContainer,
        this.options.dateFormat.day_short
      );
    },

    autoScheduling: function (link = this.options.links[0], index = 0) {
      if (link) {
        let source = document.querySelector(
          `[zt-gantt-taskbar-id="${link.source}"]`
        );

        let target = document.querySelector(
          `[zt-gantt-taskbar-id="${link.target}"]`
        );

        if (!source || !target) {
          return;
        }

        let sourceLeft = source.offsetLeft,
          sourceWidth = source.offsetWidth,
          targetLeft = target.offsetLeft,
          targetWidth = target.offsetWidth;

        if (link.type === 1) {
          if (targetLeft < sourceLeft) {
            target.style.left = sourceLeft + "px";
          }
        } else if (link.type === 2) {
          if (targetLeft + targetWidth < sourceLeft + sourceWidth) {
            target.style.left =
              targetLeft +
              (sourceLeft + sourceWidth - (targetLeft + targetWidth)) +
              "px";
          }
        } else if (link.type === 3) {
          if (targetLeft + targetWidth < sourceLeft) {
            target.style.left = sourceLeft - targetWidth + "px";
          }
        } else if (link.type === 0) {
          if (targetLeft < sourceLeft + sourceWidth) {
            target.style.left = sourceLeft + sourceWidth + "px";
          }
        }

        let task = this.getTask(link.target);
        let taskStartDate =
          this.dates[
            Math.round(
              target.offsetLeft /
                this.calculateGridWidth(task.start_date, "day")
            ) - (task.type === "milestone" ? 1 : 0)
          ];

        let taskEndDate =
          this.dates[
            Math.round(
              (target.offsetLeft + target.offsetWidth) /
                this.calculateGridWidth(task.start_date, "day")
            ) - 1
          ];

        // if taskStartDate is less than the gantt range
        if (!taskStartDate) {
          let dateDiff = Math.round(
            target.offsetLeft / this.calculateGridWidth(task.start_date, "day")
          );
          taskStartDate = this.add(new Date(this.dates[0]), dateDiff, "day");
        }

        // if taskEndDate is greater than the gantt range
        if (!taskEndDate) {
          let dateDiff =
            Math.round(
              (target.offsetLeft + target.offsetWidth) /
                this.calculateGridWidth(task.start_date, "day")
            ) - this.dates.length;
          taskEndDate = this.add(
            new Date(this.dates[this.dates.length - 1]),
            dateDiff,
            "day"
          );
        }
        this.updateTask(task, taskStartDate, taskEndDate, target);

        const onAutoScheduling = new CustomEvent("onAutoScheduling", {
          detail: {
            task: task,
          },
        });
        this.element.dispatchEvent(onAutoScheduling);
      }
      if (this.options.links.length > index) {
        index = index + 1;
        this.autoScheduling(this.options.links[index], index);
      }
    },

    // check for has cycle or not
    hasCycle: function (currentSource, currentTarget, linkId = "") {
      if (currentTarget === null) {
        return;
      }
      let targetParent = this.getTask(currentTarget).parent;
      if (targetParent == currentSource) {
        return true;
      }
      let currentSourceTask = this.getTask(currentSource);
      let currentTargetTask = this.getTask(currentTarget);
      if (currentSourceTask.children && currentSourceTask.children.length > 0) {
        let isChild = findTask(currentSourceTask, "source");
        if (isChild) {
          return isChild;
        }
      }

      if (currentTargetTask.children && currentTargetTask.children.length > 0) {
        let isChild = findTask(currentTargetTask, "target");
        if (isChild) {
          return isChild;
        }
      }

      // check is child or parent
      function findTask(parentTask, type) {
        for (const task of parentTask.children) {
          if (
            (type === "source" && task.id == currentTarget) ||
            (type === "target" && task.id == currentSource)
          ) {
            return true;
          } else if (task.children && task.children.length > 0) {
            return findTask(task, type);
          }
        }
        return false;
      }

      let links = this.options.links;
      if (currentSource == currentTarget) {
        return true;
      }

      let filteredLinks = links.filter(
        (link) => link.target == currentSource && link.id != linkId
      );
      if (filteredLinks.length === 0) {
        return false;
      }

      for (let link of filteredLinks) {
        if (link.source == currentTarget) {
          return true;
        } else if (this.hasCycle(link.source, currentTarget, link.id)) {
          return true;
        }
        return false;
      }
    },

    throwError: function (error) {
      throw new Error(error);
    },

    toastr: function (title, message, type) {
      let toastr = document.createElement("div");
      toastr.classList.add("zt-gantt-toastr", type);
      let titleDiv = document.createElement("p");
      let messageDiv = document.createElement("p");
      titleDiv.innerHTML = title;
      messageDiv.innerHTML = message;
      toastr.append(titleDiv, messageDiv);
      toastr.classList.add("show", type);
      document.body.append(toastr);

      setTimeout(function () {
        toastr.classList.remove("show");
        toastr.remove();
      }, 3000);
    },

    getDateTimeComponents: function (dateTimeString) {
      if (!dateTimeString) {
        return;
      }
      const format = this.options.date_format;
      const regex = /%([dmyhis])|(\b\w+\b)/gi;
      const dateTimeParts = dateTimeString.split(/[^\w]+|T/);

      let matchedParts = format.match(regex);
      matchedParts = matchedParts.join(",").replaceAll("%", "").split(",");

      const components = {
        day: 1,
        month: 0,
        year: new Date().getFullYear(),
        hour: 0,
        minute: 0,
        second: 0,
        date: null,
      };

      for (let i in matchedParts) {
        const part = matchedParts[i];
        const value = parseInt(dateTimeParts[i]);
        switch (part) {
          case "d":
            components.day = value;
            break;
          case "m":
            components.month = +value - 1;
            break;
          case "j":
            components.day = value;
            break;
          case "n":
            components.month = +value - 1;
            break;
          case "y":
            components.year = parseYear(value);
            break;
          case "Y":
            components.year = value;
            break;
          case "M":
            components.month = getIndexByValue(
              this.options.dateFormat.month_short,
              value
            );
            break;
          case "F":
            components.month = getIndexByValue(
              this.options.dateFormat.month_full,
              value
            );
            break;
          case "h":
            components.hour = value;
            this.hasHours = value ? true : false;
            break;
          case "g":
            components.hour = value;
            this.hasHours = value ? true : false;
            break;
          case "G":
            components.hour = value;
            this.hasHours = value ? true : false;
            break;
          case "H":
            components.hour = value;
            this.hasHours = value ? true : false;
            break;
          case "i":
            components.minute = value;
            break;
          case "s":
            components.second = value;
            break;
          default:
            components.extra = value;
            break;
        }
      }

      components.date = new Date(
        components.year,
        components.month,
        components.day,
        components.hour,
        components.minute,
        components.second
      );
      return components.date;

      function getIndexByValue(arr, value) {
        return arr.findIndex((item) => item === value);
      }

      function parseYear(year) {
        const currentYear = new Date().getFullYear();
        const currentCentury = Math.floor(currentYear / 100) * 100;
        const currentDecade = currentYear % 100;

        if (year <= currentDecade) {
          return currentCentury + year;
        } else {
          return currentCentury - 100 + year;
        }
      }
    },

    changeTaskbarColor: function (
      taskbar,
      colorInput,
      taskProgress,
      taskbarContent,
      task
    ) {
      let that = this;
      colorInput.addEventListener("change", (e) => {
        if (task.type === "milestone") {
          taskbarContent.style.setProperty(
            "background-color",
            e.target.value,
            "important"
          );
        } else {
          taskbar.style.setProperty(
            "background-color",
            that.changeOpacity(e.target.value, that.options.taskOpacity),
            "important"
          );

          taskbar.style.setProperty(
            "border-color",
            e.target.value,
            "important"
          );
        }
        if (taskProgress) {
          taskProgress.style.setProperty(
            "background-color",
            e.target.value,
            "important"
          );
        }

        setColorToOriginalData(e.target.value);

        // handle custom event
        const onColorChange = new CustomEvent("onColorChange", {
          detail: {
            taskColor: e.target.value,
            task: task,
          },
        });
        that.element.dispatchEvent(onColorChange);
      });

      colorInput.addEventListener("input", function (e) {
        if (task.type === "milestone") {
          taskbarContent.style.setProperty(
            "background-color",
            e.target.value,
            "important"
          );
        } else {
          taskbar.style.setProperty(
            "background-color",
            that.changeOpacity(e.target.value, that.options.taskOpacity),
            "important"
          );

          taskbar.style.setProperty(
            "border-color",
            e.target.value,
            "important"
          );
        }

        if (taskProgress) {
          taskProgress.style.setProperty(
            "background-color",
            e.target.value,
            "important"
          );
        }
      });

      function setColorToOriginalData(color) {
        task.taskColor = color;
        that.originalData.findIndex((item) => {
          if (item.id == task.id) {
            item.taskColor = color;
          }
        });
      }
    },

    changeOpacity: function (color, opacity) {
      var tempElement = document.createElement("div");
      tempElement.style.color = color;
      document.body.appendChild(tempElement);
      var computedColor = window.getComputedStyle(tempElement).color;
      document.body.removeChild(tempElement);

      var rgbaColor = computedColor
        .replace("rgb", "rgba")
        .replace(")", "," + opacity + ")");
      return rgbaColor;
    },

    setLocalLang: function (language) {
      this.options.localLang = language;
      this.options.currentLanguage = this.options.i18n[language];
      this.updateBody();
    },

    destroy: function () {
      let layout = document.querySelector("#zt-gantt-layout");
      let tooltip = document.querySelector("#zt-gantt-tooltip");
      if (layout) {
        layout.remove();
      }
      if (tooltip) {
        tooltip.remove();
      }
    },
  };

  global.ztGantt = ZTGantt;
})(this);

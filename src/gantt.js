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
  class ztGantt {
    #arrangeData = true;
    #originalData = [];
    #ganttHeight = 0;
    #debounceTimers = new Map();
    #searchedData = undefined;
    ztGanttLayout = null;
    #eventValue = true;
    #dateFormat = {
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
    };

    constructor(element, options, templates) {
      this.element = element;
      this.initializeOptions(options);
      this.initTemplates(templates);

      this.handleFullScreenChangeSafari =
        this.handleFullScreenChangeSafari.bind(this);
      this.handleFullScreenChange = this.handleFullScreenChange.bind(this);
      this.handleResizeWindow = this.handleResizeWindow.bind(this);

      this.init();
    }

    // initialize Options
    initializeOptions(opt = {}) {
      this.options = {
        date_format: opt.date_format,
        columns: opt.columns || [],
        rightGrid: opt.rightGrid,
        data: opt.data || [],
        collapse: opt.collapse !== false,
        fullWeek: opt.fullWeek !== false,
        todayMarker: opt.todayMarker !== false,
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
        fullCell: opt.fullCell !== false,
        taskColor: opt.taskColor || false,
        taskOpacity: opt.taskOpacity || 0.8,
        addLinks: opt.addLinks || false,
        exportApi: opt.exportApi,
        updateLinkOnDrag: opt.updateLinkOnDrag !== false,
        splitTask: opt.splitTask || false,
        links: opt.links || [],
        selectAreaOnDrag: opt.selectAreaOnDrag || false,
        taskProgress: opt.taskProgress || true,
        mouseScroll: opt.mouseScroll || false,
        ctrlKeyRequiredForMouseScroll:
          opt.ctrlKeyRequiredForMouseScroll !== false,
        sort: opt.sort || false,
        dropArea: opt.dropArea !== false,
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
    }

    // initialize templates
    initTemplates(templ = {}) {
      this.templates = {
        tooltip_text:
          templ.tooltip_text ||
          ((start, end, task) =>
            `<b>Task:</b> ${task.text}<br/><b>Start date:</b> ${start}<br/><b>End date:</b> ${end}`),
        taskbar_text: templ.taskbar_text || ((start, end, task) => task.text),
        task_drag: templ.task_drag || true,
        grid_folder: templ.grid_folder || "",
        grid_file: templ.grid_file || "",
        grid_blank: templ.grid_blank || "",
        showLightBox: templ.showLightBox || undefined,
        grid_header_class: templ.grid_header_class || undefined,
        grid_row_class: templ.grid_row_class || undefined,
        task_class: templ.task_class || undefined,
        task_row_class: templ.task_row_class || undefined,
        scale_cell_class: templ.scale_cell_class || undefined,
        grid_cell_class: templ.grid_cell_class || undefined,
        timeline_cell_class: templ.timeline_cell_class || undefined,
      };
    }

    /**
     * Get an array of dates between the range of startDate and endDate.
     * @param {Date} startDate - The start date of the range.
     * @param {Date} endDate - The end date of the range.
     * @param {boolean} [filterWeekends=true] - Whether to filter out weekends from the date range.
     * @returns {Array<number>} - An array of dates (timestamps) between the start and end dates.
     */
    getDates(startDate, endDate, filterWeekends = true) {
      // Convert to timestamps and normalize to start of the day
      const start = new Date(startDate).setHours(0, 0, 0, 0);
      const end = new Date(endDate).setHours(0, 0, 0, 0);

      const weekday = this.#dateFormat.day_short;

      // Array to hold the dates
      const dates = [];

      // Loop through each date from start to end
      for (
        let currentDate = start;
        currentDate <= end;
        currentDate += 86400000
      ) {
        const dayName = weekday[new Date(currentDate).getDay()];
        // if fullWeek is false then don't push weekends date in dates array
        if (
          filterWeekends &&
          !this.options.fullWeek &&
          this.options.weekends.includes(dayName)
        ) {
          continue;
        }
        dates.push(currentDate);
      }

      return dates;
    }

    /**
     * initialize events
     */
    init() {
      this.options.currentLanguage = this.options.i18n[this.options.localLang];

      /*for Safari below v16 */
      document.removeEventListener(
        "webkitfullscreenchange",
        this.handleFullScreenChangeSafari
      );
      document.addEventListener(
        "webkitfullscreenchange",
        this.handleFullScreenChangeSafari
      );

      // Listen for the fullscreenchange event
      document.removeEventListener(
        "fullscreenchange",
        this.handleFullScreenChange
      );
      document.addEventListener(
        "fullscreenchange",
        this.handleFullScreenChange
      );

      window.removeEventListener("resize", this.handleResizeWindow);
      window.addEventListener("resize", this.handleResizeWindow);

      this.createTooltip();

      if (this.templates?.showLightBox !== false) {
        this.createLightbox();
      }
    }

    handleResizeWindow(event) {
      if (
        this.calculateTimeLineWidth("updated") !==
        this.calculateTimeLineWidth("current")
      ) {
        this.updateBody();
      }

      // handle custom event
      this.dispatchEvent("onResize", { event });
    }

    handleFullScreenChangeSafari() {
      // Check if full screen mode has been exited
      if (!document.webkitIsFullScreen) {
        this.element.classList.remove("zt-gantt-fullScreen");
        this.exitFullScreen(true);
      }
    }

    handleFullScreenChange() {
      // Check if full screen mode has been exited
      if (!document.fullscreenElement) {
        this.element.classList.remove("zt-gantt-fullScreen");
        this.exitFullScreen(true);
      }
    }

    /**
     * Method to render the gantt chart.
     * @param {HTMLElement} element - gantt html element (optional).
     */
    render(ele = this.element) {
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

      this.element = ele;
      const options = this.options;
      this.options.currentLanguage = this.options.i18n[this.options.localLang];
      this.zoomInit("initial");

      // create a copy of the data
      if (this.#arrangeData) {
        this.#originalData = [...this.options.data];
      }

      const originalData = this.#originalData;
      const { date_format } = options;

      // process task start and end date
      const processDate = (date) => {
        const parsedDate = new Date(date);
        if (isNaN(parsedDate) && date_format) {
          return this.getDateTimeComponents(date);
        } else if (!isNaN(parsedDate) && !parsedDate.getHours()) {
          return this.stripTime(parsedDate);
        }
        return date;
      };

      function createNestedTree(
        flatArray,
        parentIdKey = "parent",
        idKey = "id"
      ) {
        const tree = [];

        const map = {};
        flatArray.forEach((item, i) => {
          if (originalData[i].start_date !== undefined) {
            originalData[i].start_date = processDate(
              originalData[i].start_date
            );
          }

          if (originalData[i].end_date !== undefined) {
            originalData[i].end_date = processDate(originalData[i].end_date);
          }

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

      this.options.data = createNestedTree(this.#originalData);

      // calculate and add duration and start and end date in all data objects
      this.updateTaskDuration();

      this.#arrangeData = false;

      if (!this.options.startDate || !this.options.endDate) {
        const { startDate, endDate } = this.getStartAndEndDate();
        this.options.startDate = this.options.startDate || startDate;
        this.options.endDate = this.options.endDate || endDate;
      }

      const startDateTimestamp = this.stripTime(options.startDate).getTime();
      const endDateTimestamp = this.stripTime(options.endDate).getTime();
      if (
        !this.dates ||
        startDateTimestamp != this.dates[0] ||
        endDateTimestamp != this.dates[this.dates.length - 1]
      ) {
        this.dates = this.getDates(options.startDate, options.endDate);
      }

      // set all task expanded initially if collapse is false
      if (!options.collapse && !options?.openedTasks?.length) {
        this.options.openedTasks = this.#originalData.map((task) => task?.id);
      }

      if (this.fullScreen === true) {
        this.element.classList.add("zt-gantt-fullScreen");
      }

      const ztGanttLayout = document.createElement("div");
      ztGanttLayout.classList.add("zt-gantt-layout", "zt-gantt-d-flex");
      ztGanttLayout.id = "zt-gantt-layout";

      this.ztGanttLayout = ztGanttLayout;

      this.createSidebar();

      const timeline = document.createElement("div");
      timeline.classList.add("zt-gantt-timeline-cell");
      timeline.id = "zt-gantt-timeline-cell";

      this.createTimelineScale(timeline);
      this.createTimelineBody(timeline, true);

      if (options?.rightGrid) {
        let newGridOptions = { ...options };
        newGridOptions.columns = options.rightGrid;
        this.createRightSidebar(newGridOptions);
      }

      const verScroll =
        this.element.querySelector(".zt-gantt-ver-scroll")?.scrollTop || 0;
      const horScroll =
        this.element.querySelector(".zt-gantt-hor-scroll")?.scrollLeft || 0;

      // append zt-gantt-layout in element
      const layout = this.element.querySelector("#zt-gantt-layout");
      if (layout) {
        layout.replaceWith(ztGanttLayout);
      } else {
        this.element.append(ztGanttLayout);
      }

      this.createScrollbar(verScroll || 0, horScroll || 0);

      const timelineDataContainer = this.element.querySelector(
        "#zt-gantt-timeline-data"
      );

      if (!this.markerArea) {
        const markerArea = document.createElement("div");
        markerArea.classList.add("zt-gantt-marker-area");
        this.markerArea = markerArea;

        // add all markers
        for (let marker of this.options.customMarker) {
          if (this.outOfGanttRange(marker?.start_date)) continue;
          this.addMarkerToGantt(marker);
        }

        if (options.todayMarker) {
          this.addTodayFlag();
        }
      }
      timelineDataContainer.append(this.markerArea);

      // add today marker
      const linksArea = document.createElement("div");
      linksArea.classList.add("zt-gantt-links-area");
      linksArea.id = "zt-gantt-links-area";
      timelineDataContainer.append(linksArea);

      // create links
      for (let i = 0; i < this.options.links.length; i++) {
        this.createLinks(
          this.options.links[i].source,
          this.options.links[i].target,
          this.options.links[i]
        );
      }
    }

    // create left sidebar
    createSidebar() {
      const ztGanttLayout = this.ztGanttLayout;
      const options = this.options;

      // sidebar head cells
      const sidebar = document.createElement("div");
      sidebar.classList.add("zt-gantt-left-cell");
      sidebar.id = "zt-gantt-grid-left-data";

      const headCellContainer = document.createElement("div");
      headCellContainer.classList.add("sidebar-head-cell-container");

      let containerHeight = this.calculateScaleHeight("header");

      const totalWidth = options.columns.reduce(
        (totalWidth, col) => totalWidth + col.width,
        0
      );

      sidebar.style.width = `${totalWidth}px`;
      sidebar.style.minWidth = `${totalWidth}px`;

      headCellContainer.style.height = containerHeight;
      headCellContainer.style.lineHeight = containerHeight;

      sidebar.append(headCellContainer);

      let resizerLeft = 0;

      // head loop of left side
      for (let i = 0; i < options.columns.length; i++) {
        const column = options.columns[i];
        let headCell = document.createElement("div");
        headCell.classList.add("head-cell");

        //add custom class from user
        this.addClassesFromFunction(
          this.templates.grid_header_class,
          headCell,
          column,
          i
        );

        headCell.setAttribute("data-column-index", i);
        headCell.style.width = (column.width || 80) + "px";
        headCell.innerHTML = column.label;
        headCellContainer.append(headCell);

        if (this.options.sort) {
          headCell.addEventListener("click", () => {
            let isAsc = !this.options?.sortOption?.isAsc;
            const sortBy = column?.name;

            if (sortBy !== this.options?.sortOption?.sortBy) {
              isAsc = true; // Set isAsc to true by default if sortBy is different
            }
            this.options.sortOption = { sortBy, isAsc };
            this.sort(sortBy, isAsc);
          });

          // add sort icon to the current sorting column
          if (
            this.options?.sortOption &&
            this.options?.sortOption?.sortBy == column?.name
          ) {
            const sortIcon = document.createElement("div");
            let isAsc = !this.options?.sortOption?.isAsc;
            sortIcon.classList.add(
              "zt-gantt-sort",
              isAsc ? "zt-gantt-asc" : "zt-gantt-desc"
            );
            headCell.appendChild(sortIcon);
          }
        }

        if (i < options.columns.length) {
          const resizerWrap = document.createElement("div");
          resizerWrap.classList.add("zt-gantt-col-resizer-wrap");
          resizerWrap.id = "zt-gantt-col-resizer-wrap-" + i;
          resizerWrap.style.height = this.calculateScaleHeight("header");

          if (column.resize === true) {
            const resizer = document.createElement("div");
            resizer.classList.add("zt-gantt-col-resizer");
            resizerWrap.append(resizer);
            resizerLeft += column.width || 80;
            resizerWrap.style.left = resizerLeft + "px";
            headCellContainer.append(resizerWrap);
            this.resizeColumns(
              resizerWrap,
              `data-column-index="${i}"`,
              headCell,
              headCellContainer,
              column.min_width,
              column.max_width,
              i,
              sidebar,
              false
            );
          }
        }
      }

      // data loop of left side
      const leftDataContainer = document.createElement("div");
      leftDataContainer.classList.add("zt-gantt-grid-data");
      leftDataContainer.id = "zt-gantt-left-grid";

      // loop through all the data
      for (let j = 0; j < options.data.length; j++) {
        const task = this.options.data[j];
        if (!this.isTaskNotInSearchedData(task.id)) {
          if (this.#searchedData) {
            this.addTaskToOpenedList(task.id);
          }

          const dataItem = document.createElement("div");
          dataItem.classList.add(
            "zt-gantt-row-item",
            "zt-gantt-d-flex",
            this.options.selectedRow === `${task.id}`
              ? "zt-gantt-selected"
              : "zt-gantt-row-item"
          );

          const { start_date, end_date } = this.getLargeAndSmallDate(task);

          //add custom classes from user
          this.addClassesFromFunction(
            this.templates.grid_row_class,
            dataItem,
            start_date,
            end_date,
            task
          );

          dataItem.setAttribute("zt-gantt-data-task-id", j);
          dataItem.setAttribute("zt-gantt-task-id", task.id);
          dataItem.style.height = options.row_height + "px";
          dataItem.style.lineHeight = options.row_height + "px";

          const that = this;

          // handle double click event
          dataItem.addEventListener("dblclick", handleDblClick);

          function handleDblClick(e) {
            if (e.target.classList.contains("zt-gantt-tree-icon")) {
              return;
            }
            // custom event handler
            that.dispatchEvent("onBeforeTaskDblClick", {
              task,
            });

            // if onBeforeTaskDblClick return false then do not drag the task
            if (that.#eventValue === false) {
              that.#eventValue = true;
              return;
            }

            that.dispatchEvent("onTaskDblClick", {
              task,
            });

            that.showLightBox(task);
          }

          // Handle mouseover event
          dataItem.addEventListener("mouseover", () => {
            this.updateTooltipBody(task);
          });

          // Handle mouseleave event
          dataItem.addEventListener("mouseleave", this.hideTooltip.bind(this));

          this.addClickListener(dataItem, (e) => {
            if (e.target.classList.contains("zt-gantt-tree-icon")) {
              return;
            }

            // select task
            that.selectTask(task);
          });

          // loop through all the columns
          for (let k = 0; k < this.options.columns.length; k++) {
            const column = this.options.columns[k];
            const cell = document.createElement("div");
            cell.classList.add("zt-gantt-cell");

            //add custom class from user
            this.addClassesFromFunction(
              this.templates.grid_cell_class,
              cell,
              column,
              task
            );

            cell.style.width = (column.width || 80) + "px";

            column.align ? (cell.style.textAlign = column.align) : "";

            column.align ? (cell.style.justifyContent = column.align) : "";

            const content = document.createElement("div");
            content.classList.add(
              "zt-gantt-cell-data",
              `${k == 0 ? "zt-gantt-d-block" : "zt-gantt-data"}`
            );
            cell.setAttribute("data-column-index", k);

            let ztGanttBlank = document.createElement("div");
            ztGanttBlank.classList.add("zt-gantt-blank");

            ztGanttBlank.innerHTML = this.callTemplate("grid_blank", task);

            // function to get content HTML
            const getContentHTML = () => {
              return column.template(task) || task[column.name] || " ";
            };

            // content of the column
            content.innerHTML = getContentHTML();

            this.attachEvent("onAfterTaskUpdate", () => {
              content.innerHTML = getContentHTML();
            });

            // update content innerHTML on after progress drag
            this.attachEvent("onAfterProgressDrag", () => {
              content.innerHTML = getContentHTML();
            });

            this.attachEvent("onTaskDrag", () => {
              content.innerHTML = getContentHTML();
            });

            this.attachEvent("onAfterTaskDrag", () => {
              content.innerHTML = getContentHTML();
            });

            if (column.tree) {
              cell.classList.add("zt-gantt-d-flex");

              // folder icon
              const folderIcon = document.createElement("div");
              folderIcon.classList.add("zt-gantt-folder-icon");
              folderIcon.innerHTML = this.callTemplate("grid_folder", task);

              if (
                task.children &&
                task?.children?.length &&
                !this.options.splitTask
              ) {
                // tree icon
                const treeIcon = document.createElement("div");
                treeIcon.classList.add(
                  "zt-gantt-tree-icon",
                  !this.isTaskOpened(task.id)
                    ? "zt-gantt-tree-close"
                    : "zt-gantt-tree-open"
                );
                treeIcon.id = `toggle-tree-${j}`;
                cell.append(treeIcon);

                // toggle children
                this.addClickListener(treeIcon, () => {
                  const isTaskCollapse = !this.isTaskOpened(task.id);

                  if (isTaskCollapse) {
                    this.addTaskToOpenedList(task.id);
                  } else {
                    this.removeTaskFromOpenedList(task.id);
                  }

                  this.setCollapseAll(
                    task.children,
                    task.id,
                    isTaskCollapse ? "open" : "collapse"
                  );

                  this.createTaskBars();

                  treeIcon.classList.toggle("zt-gantt-tree-close");
                  treeIcon.classList.toggle("zt-gantt-tree-open");

                  this.createScrollbar();

                  // custom event of toggle tree
                  this.dispatchEvent("onTaskToggle", {
                    task,
                    isTaskOpened: isTaskCollapse,
                  });
                });
              } else if (!this.options.splitTask) {
                cell.append(ztGanttBlank);
              }
              cell.append(folderIcon);
            }
            cell.append(content);
            dataItem.append(cell);

            if (column?.editor) {
              cell.addEventListener("click", (e) => {
                if (e.target.classList.contains("zt-gantt-tree-icon")) return;
                this.addInlineEditor(
                  task,
                  column.editor,
                  cell,
                  leftDataContainer
                );
              });
            }
          }

          leftDataContainer.append(dataItem);
        }

        if (!this.options.splitTask && task?.children?.length) {
          this.createSidebarChild(
            task.children,
            options,
            leftDataContainer,
            1,
            j,
            false,
            this.isTaskOpened(task.id)
          );
        }
      }

      sidebar.append(leftDataContainer);
      ztGanttLayout.append(sidebar);

      const sidebarResizerWrap = document.createElement("div");
      sidebarResizerWrap.classList.add("zt-gantt-left-layout-resizer-wrap");
      sidebarResizerWrap.id = "zt-gantt-left-layout-resizer-wrap";

      const sidebarResizer = document.createElement("div");
      sidebarResizer.classList.add("zt-gantt-left-layout-resizer");
      sidebarResizerWrap.append(sidebarResizer);
      ztGanttLayout.append(sidebarResizerWrap);
      sidebarResizerWrap.style.left = `${totalWidth}px`;
      this.resizeSidebar(sidebarResizerWrap, sidebarResizer, sidebar);
    }

    // create header of scale
    createTimelineScale(timeline) {
      const options = this.options;
      const dates = this.dates;

      this.#ganttHeight = this.calculateGanttHeight;
      this.attachEvent("onTaskToggle", () => {
        const tempHeight = this.calculateGanttHeight;
        const isVerScrollExist = this.#ganttHeight > this.element.offsetHeight;

        if (
          (!isVerScrollExist && tempHeight > this.element.offsetHeight) ||
          (isVerScrollExist && tempHeight < this.element.offsetHeight)
        ) {
          this.#ganttHeight = tempHeight;
          this.updateBody();
        }
      });

      const timelineScale = document.createElement("div");
      timelineScale.classList.add("zt-gantt-scale");
      timelineScale.style.height = this.calculateScaleHeight("header");

      for (let i = 0; i < options.scales.length; i++) {
        const scale = options.scales[i];
        const timelineScaleRow = document.createElement("div");
        timelineScaleRow.classList.add(`zt-gantt-scale-row`);

        const timelineScaleHeight = this.calculateScaleHeight("body", i);
        timelineScaleRow.style.height = timelineScaleHeight;
        timelineScaleRow.style.lineHeight = timelineScaleHeight;

        let rangeCount = 0;
        let endDate = new Date(0).getTime();

        for (let j = 0; j < dates.length; j++) {
          const date = dates[j];
          if (
            new Date(endDate).getTime() >= new Date(date).setHours(0, 0, 0, 0)
          ) {
            continue;
          }
          let dateFormat = this.isFunction(scale.format)
            ? scale.format(new Date(date))
            : this.formatDateToString(scale.format, date);
          let colDates;

          // if date scale unit is week || month || year || (day && step > 1)
          if (isMultiUnitScale(scale)) {
            colDates = this.initColSizes(scale.unit, scale.step, date);
          }

          function isMultiUnitScale(scale) {
            return (
              (scale.unit === "day" && scale.step > 1) ||
              ["week", "month", "quarter", "year"].includes(scale.unit)
            );
          }

          const dateCell = document.createElement("div");
          dateCell.classList.add("zt-gantt-scale-cell");

          //add custom class from user
          this.addClassesFromFunction(
            this.templates.scale_cell_class,
            dateCell,
            date,
            scale,
            i
          );

          dateCell.innerHTML = `<span class="date-scale">${dateFormat}</span>`;

          if (isMultiUnitScale(scale)) {
            dateCell.style.width =
              colDates.dateCount * this.calculateGridWidth(date) + "px";
            dateCell.style.left = rangeCount + "px";
          } else {
            dateCell.style.left =
              j * this.calculateGridWidth(date, "day") + "px";
            dateCell.style.width = this.calculateGridWidth(date, "day") + "px";
          }
          let currentDate = new Date(date).setHours(0, 0, 0, 0);
          if (
            isMultiUnitScale(scale) &&
            new Date(endDate).getTime() < currentDate
          ) {
            timelineScaleRow.append(dateCell);
            rangeCount += colDates.dateCount * this.calculateGridWidth(date);
            endDate = new Date(colDates.endDate);
          } else if (scale.unit == "hour") {
            let dateStartHour = new Date(date).getHours();
            let cellDate = new Date(date);
            let cellWidth = this.calculateGridWidth(date);

            const fragment = document.createDocumentFragment();
            for (let k = dateStartHour; k < 24; k++) {
              let hourCell = dateCell.cloneNode(true);

              let dateFormat = this.isFunction(scale.format)
                ? scale.format(cellDate)
                : this.formatDateToString(scale.format, cellDate);

              hourCell.innerHTML = dateFormat;
              cellDate.setHours(k + 1);
              hourCell.style.width = cellWidth + "px";
              hourCell.style.left = rangeCount + "px";
              // timelineScaleRow.append(hourCell);
              fragment.appendChild(hourCell);
              rangeCount += cellWidth;
            }
            timelineScaleRow.append(fragment);
          } else if (scale.unit == "day" && scale.step == 1) {
            timelineScaleRow.append(dateCell);
          }
        }
        timelineScale.append(timelineScaleRow);
      }
      timelineScale.style.width =
        this.calculateTimeLineWidth("updated", "day") + "px";
      timeline.append(timelineScale);
    }

    // create grid body
    createTimelineBody(timeline, isFromRender = false) {
      const ztGanttLayout = this.ztGanttLayout;
      const options = this.options;
      const timelineDataContainer = document.createElement("div");
      timelineDataContainer.classList.add("zt-gantt-timeline-data");
      timelineDataContainer.id = "zt-gantt-timeline-data";

      if (this.options.dropArea) {
        const dropArea = document.createElement("div");
        dropArea.classList.add("drop-area");
        timelineDataContainer.appendChild(dropArea);
      }

      const ztGanttTaskData = document.createElement("div");
      ztGanttTaskData.classList.add("zt-gantt-task-data");

      const timelineRowTemplate = this.createRowTemplate();
      // grid data loop
      for (let j = 0; j < options.data.length; j++) {
        const task = this.options.data[j];
        if (!this.isTaskNotInSearchedData(task.id)) {
          const timelineRow = timelineRowTemplate.cloneNode(true);
          const isSelected = options.selectedRow === `${task.id}`;

          if (isSelected) timelineRow.classList.add("zt-gantt-selected");

          timelineRow.setAttribute("zt-gantt-data-task-id", j);
          timelineRow.setAttribute("zt-gantt-task-id", task.id);

          //add custom classes from user
          const { start_date, end_date } = this.getLargeAndSmallDate(task);

          this.addClassesFromFunction(
            this.templates.task_row_class,
            timelineRow,
            start_date,
            end_date,
            task
          );

          // handle cell click event
          this.addClickListener(timelineRow, (e) => {
            if (e.target.classList.contains("zt-gantt-task-cell")) {
              this.dispatchEvent("onCellClick", {
                task,
                cellDate: e.target.getAttribute("zt-gantt-cell-date"),
              });
            }
          });

          ztGanttTaskData.append(timelineRow);
        }

        // if children exist
        if (task?.children?.length && !this.options.splitTask) {
          this.createTimelineChildBody(
            task.children,
            ztGanttTaskData,
            j,
            this.isTaskOpened(task.id),
            timelineRowTemplate
          );
        }
      }

      timelineDataContainer.style.width =
        this.calculateTimeLineWidth("updated", "day") + "px";

      timelineDataContainer.append(ztGanttTaskData);
      timeline.append(timelineDataContainer);

      let isCalendarExist = this.element.querySelector(
        "#zt-gantt-timeline-cell"
      );

      if (isCalendarExist && isFromRender === false) {
        isCalendarExist.replaceWith(timeline);
      } else {
        ztGanttLayout.append(timeline);
      }

      this.createTaskBars(timelineDataContainer, isFromRender);

      // create custom scroller
      if (!isFromRender) {
        this.createScrollbar(this.verScroll || 0, this.horScroll || 0);

        if (!this.markerArea) {
          const markerArea = document.createElement("div");
          markerArea.classList.add("zt-gantt-marker-area");
          this.markerArea = markerArea;

          // add all markers
          for (let marker of this.options.customMarker) {
            if (this.outOfGanttRange(marker?.start_date)) continue;
            this.addMarkerToGantt(marker);
          }

          // add today marker
          if (options.todayMarker) {
            this.addTodayFlag();
          }
        }
        timelineDataContainer.append(this.markerArea);
      }

      if (this.options.selectAreaOnDrag === true) {
        this.selectAreaOnDrag(timelineDataContainer);
      }
    }

    /**
     * Method to create a timeline row template
     * @returns { HTMLElement } timelineRow
     */
    createRowTemplate() {
      const { options, dates } = this;
      const weekday = this.#dateFormat.day_short;

      const timelineRow = document.createElement("div");
      timelineRow.classList.add("zt-gantt-task-row");

      timelineRow.style.height = options.row_height + "px";

      let cellEndDate = new Date(0);
      let rangeCount = 0;

      const dateFormat =
        this.options.zoomLevel === "day"
          ? "%Y-%m-%d"
          : this.options.zoomLevel === "week"
          ? "W-%W"
          : this.options.zoomLevel === "month"
          ? "M-%m"
          : this.options.zoomLevel === "quarter"
          ? "Q-%q"
          : "%Y";

      for (let k = 0; k < dates.length; k++) {
        let date = new Date(dates[k]);

        if (new Date(cellEndDate).getTime() >= date.setHours(0, 0, 0, 0)) {
          continue;
        }

        let colDates;

        let timelineCell = document.createElement("div");

        timelineCell.classList.add("zt-gantt-task-cell");

        if (this.options.zoomLevel !== "day") {
          colDates = this.initColSizes(this.options.zoomLevel, 1, date);
        } else {
          timelineCell.classList.add(
            options.weekends.includes(weekday[date.getDay()])
              ? "zt-gantt-weekend-cell"
              : "zt-gantt-weekday-cell",
            k == 0 ? "zt-gantt-border-left-none" : "zt-gantt-task-cell"
          );
        }

        //add custom classes from user
        this.addClassesFromFunction(
          this.templates.timeline_cell_class,
          timelineCell,
          dates[k]
        );

        const gridWidth = this.calculateGridWidth(date);

        if (this.options.zoomLevel !== "day") {
          timelineCell.style.left = rangeCount + "px";

          if (this.options.zoomLevel === "hour") {
            timelineCell.style.width = gridWidth + "px";
          } else {
            timelineCell.style.width = colDates.dateCount * gridWidth + "px";
          }
        } else {
          timelineCell.style.left = gridWidth * k + "px";
          timelineCell.style.width = gridWidth + "px";
        }

        timelineCell.setAttribute(
          "zt-gantt-cell-date",
          this.formatDateToString(dateFormat, date)
        );

        let currentDate = new Date(date).setHours(0);

        if (this.options.zoomLevel === "hour") {
          let cellWidth = gridWidth;
          const fragment = document.createDocumentFragment();
          for (let i = 0; i < 24; i++) {
            const hourCell = timelineCell.cloneNode(true);
            hourCell.style.left = rangeCount + "px";
            hourCell.style.width = cellWidth + "px";
            rangeCount += cellWidth;
            // timelineRow.append(hourCell);
            fragment.appendChild(hourCell);
          }
          timelineRow.append(fragment);
        } else if (
          this.options.zoomLevel !== "day" &&
          new Date(cellEndDate).getTime() < currentDate
        ) {
          rangeCount += colDates.dateCount * gridWidth;
          cellEndDate = new Date(colDates.endDate);
          timelineRow.append(timelineCell);
        } else if (this.options.zoomLevel === "day") {
          timelineRow.append(timelineCell);
        }
      }

      return timelineRow;
    }

    /**
     * Method to create taskbars
     */
    createTaskBars(barContainer = null, isFromRender = false) {
      // if splitTask is true then run this.createSplitTask
      if (this.options.splitTask) {
        this.createSplitTask(barContainer, isFromRender);
        return;
      }

      let rowCount = 0;

      const ztGanttBarsArea = document.createElement("div");
      ztGanttBarsArea.classList.add("zt-gantt-bars-area");
      ztGanttBarsArea.id = "zt-gantt-bars-area";

      for (let j = 0; j < this.options.data.length; j++) {
        const task = this.options.data[j];
        let cellStartDate = this.options.startDate;

        if (!this.isTaskNotInSearchedData(task.id)) {
          let start_date = new Date(task.start_date);
          let end_date = new Date(task.end_date);

          if (task.children?.length) {
            ({ start_date, end_date } = this.getLargeAndSmallDate(task));
          }

          let isCellGreater = true;
          let cellBefore = this.getDates(
            cellStartDate,
            task.type === "milestone" ? task.start_date : start_date
          );

          if (cellBefore.length === 0) {
            cellBefore = this.getDates(start_date, cellStartDate);
            isCellGreater = false;
          }

          if (isCellGreater) {
            cellBefore = cellBefore.length - 1;
          } else {
            cellBefore = -(cellBefore.length - 1);
          }
          let ztGanttBarTask = document.createElement("div");

          if (task.taskColor && task.type !== "milestone") {
            ztGanttBarTask.style.setProperty(
              "background-color",
              this.changeOpacity(task.taskColor),
              "important"
            );
            ztGanttBarTask.style.setProperty(
              "border-color",
              task.taskColor,
              "important"
            );
          }

          if (task.type === "milestone") {
            ztGanttBarTask.classList.add(
              "zt-gantt-bar-task",
              "zt-gantt-bar-milestone",
              this.options.selectedTask === `${task.id}`
                ? "zt-gantt-selected-task-bar"
                : "zt-gantt-bar-milestone"
            );
          } else {
            ztGanttBarTask.classList.add(
              "zt-gantt-bar-task",
              "zt-gantt-bar-parent-task",
              this.options.selectedTask === `${task.id}`
                ? "zt-gantt-selected-task-bar"
                : "zt-gantt-bar-task"
            );
          }

          //add custom class from user
          this.addClassesFromFunction(
            this.templates.task_class,
            ztGanttBarTask,
            start_date,
            end_date,
            task
          );

          ztGanttBarTask.setAttribute("task-parent", j);
          ztGanttBarTask.setAttribute("data-task-pos", 0);
          ztGanttBarTask.setAttribute("zt-gantt-taskbar-id", task.id);

          let taskLeft =
            cellBefore * this.calculateGridWidth(start_date, "day");

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
          if (task.type === "milestone") {
            ztGanttBarTask.style.width = `${barTaskHeight}px`;
            ztGanttBarTask.style.left =
              (cellBefore + 1) * this.calculateGridWidth(start_date, "day") +
              "px";
          }

          const ztGanttBarTaskContent = document.createElement("div");
          ztGanttBarTaskContent.classList.add(
            "zt-gantt-bar-task-content",
            "parent-task-bar-content"
          );

          if (task.type === "milestone" && task.taskColor) {
            ztGanttBarTaskContent.style.setProperty(
              "background-color",
              task.taskColor,
              "important"
            );

            ztGanttBarTaskContent.style.setProperty(
              "border-color",
              task.taskColor,
              "important"
            );
          }

          let that = this;

          // handle double click event
          ztGanttBarTask.addEventListener("dblclick", handleDblClick);

          function handleDblClick() {
            // custom event handler
            that.dispatchEvent("onBeforeTaskDblClick", {
              task,
            });

            // if onBeforeTaskDblClick return false then do not drag the task
            if (that.#eventValue === false) {
              that.#eventValue = true;
              return;
            }

            that.dispatchEvent("onTaskDblClick", {
              task,
            });

            that.showLightBox(task);
          }

          const userAgent = navigator.userAgent;

          // Handle mouseover event
          ztGanttBarTask.addEventListener("mouseover", handleMouseOver);

          function handleMouseOver() {
            if (/^((?!chrome|android).)*safari/i.test(userAgent)) {
              ztGanttBarTask.classList.add("hovered");
            }

            that.updateTooltipBody(task);
          }

          // Handle mouseleave event
          ztGanttBarTask.addEventListener("mouseleave", handleMouseLeave);

          function handleMouseLeave() {
            if (/^((?!chrome|android).)*safari/i.test(userAgent)) {
              ztGanttBarTask.classList.remove("hovered");
            }

            that.hideTooltip();
          }

          if (
            this.callTemplate("task_drag", "resize", task) &&
            task.type !== "milestone"
          ) {
            // left side resizer
            const ztGanttTaskDragLeft = document.createElement("div");
            ztGanttTaskDragLeft.classList.add("zt-gantt-task-drag-left");

            // right side resizer
            let ztGanttTaskDragRight = document.createElement("div");
            ztGanttTaskDragRight.classList.add("zt-gantt-task-drag-right");

            ztGanttBarTask.append(ztGanttTaskDragLeft, ztGanttTaskDragRight);
            this.resizeTaskBars(
              ztGanttTaskDragLeft,
              ztGanttBarTask,
              "left",
              task
            );

            this.resizeTaskBars(
              ztGanttTaskDragRight,
              ztGanttBarTask,
              "right",
              task
            );
          }

          let taskDates = this.getDates(start_date, end_date);

          let taskProgress;
          const isTaskProgress = this.isFunction(this.options.taskProgress)
            ? this.options.taskProgress(task)
            : this.options.taskProgress;
          if (isTaskProgress === true && task.type !== "milestone") {
            let progressPer = task.progress || 0;
            progressPer = progressPer > 100 ? 100 : progressPer;
            const taskProgressContainer = document.createElement("div");
            taskProgressContainer.classList.add(
              "zt-gantt-task-progress-wrapper"
            );
            taskProgress = document.createElement("div");
            taskProgress.classList.add("zt-gantt-task-progress");
            taskProgress.style.width = `${progressPer}%`;

            if (task.taskColor) {
              taskProgress.style.setProperty(
                "background-color",
                task.taskColor,
                "important"
              );
            }

            taskProgressContainer.append(taskProgress);

            const taskProgressDrag = document.createElement("div");
            taskProgressDrag.classList.add("zt-gantt-task-progress-drag");
            taskProgressDrag.style.left = `${progressPer}%`;

            // update the task progress onAfterTaskUpdate
            this.attachEvent("onAfterTaskUpdate", () => {
              let progress = task.progress || 0;
              taskProgress.style.width = `${progress}%`;
              taskProgressDrag.style.left = `${progress}%`;
            });

            ztGanttBarTask.append(taskProgressContainer, taskProgressDrag);
            this.dragTaskProgress(
              taskProgressDrag,
              taskProgress,
              ztGanttBarTask,
              task
            );
          }

          if (this.callTemplate("task_drag", "move", task)) {
            this.resizeTaskBars(
              ztGanttBarTaskContent,
              ztGanttBarTask,
              "move",
              task
            );
          }

          // link control pointers
          let isAddLinks = this.isFunction(this.options.addLinks)
            ? this.options.addLinks(task)
            : this.options.addLinks;

          if (isAddLinks === true) {
            // left point
            const leftLinkPoint = document.createElement("div");
            leftLinkPoint.classList.add(
              "zt-gantt-link-control",
              "zt-gantt-left-point"
            );

            const leftPoint = document.createElement("div");
            leftPoint.classList.add("zt-gantt-link-point");

            // right point
            const rightLinkPoint = document.createElement("div");
            rightLinkPoint.classList.add(
              "zt-gantt-link-control",
              "zt-gantt-right-point"
            );

            const rightPoint = document.createElement("div");
            rightPoint.classList.add("zt-gantt-link-point");

            leftLinkPoint.append(leftPoint);
            rightLinkPoint.append(rightPoint);
            ztGanttBarTask.append(leftLinkPoint, rightLinkPoint);

            this.createNewLink(rightPoint, ztGanttBarTask, task.id, "right");

            this.createNewLink(leftPoint, ztGanttBarTask, task.id, "left");
          }

          //add custom task color picker
          let isCustomColor = this.isFunction(this.options.taskColor)
            ? this.options.taskColor(task)
            : this.options.taskColor;

          if (isCustomColor) {
            const colorPicker = document.createElement("div");
            colorPicker.classList.add("zt-gantt-task-color-picker");

            const colorInput = document.createElement("input");
            colorInput.type = "color";

            setTimeout(() => {
              const backgroundElement =
                task.type === "milestone"
                  ? ztGanttBarTaskContent
                  : ztGanttBarTask;

              // Get the computed style of the element
              const backgroundColor =
                task.taskColor ||
                this.rgbaToHex(
                  window
                    .getComputedStyle(backgroundElement)
                    .getPropertyValue("background-color")
                );

              colorInput.value = backgroundColor;
            }, 0);

            colorPicker.append(colorInput);
            ztGanttBarTask.append(colorPicker);
            this.changeTaskbarColor(
              ztGanttBarTask,
              colorInput,
              taskProgress,
              ztGanttBarTaskContent,
              task
            );
          }

          if (task.type !== "milestone") {
            let taskWidth =
              taskDates.length * this.calculateGridWidth(end_date, "day");

            if (taskWidth === 0 || !taskWidth) {
              ztGanttBarTask.classList.add("zt-gantt-d-none");
            }

            let hourWidth = this.getPxByTime(end_date, "width");
            let hourLeft = this.getPxByTime(start_date, "left");
            hourWidth += hourLeft;
            taskWidth -= hourWidth;
            ztGanttBarTask.style.width = taskWidth + "px";
          }

          let sideContent;
          if (task.type === "milestone") {
            sideContent = document.createElement("div");
            sideContent.classList.add("zt-gantt-side-content");
            sideContent.innerHTML = this.callTemplate(
              "taskbar_text",
              new Date(start_date),
              new Date(end_date),
              task
            );
            ztGanttBarTask.append(sideContent);
          } else {
            ztGanttBarTaskContent.innerHTML = this.callTemplate(
              "taskbar_text",
              new Date(start_date.setHours(0)),
              new Date(end_date.setHours(0)),
              task
            );
          }
          ztGanttBarTask.append(ztGanttBarTaskContent);

          this.attachEvent("onAfterTaskUpdate", () => {
            const innerHTML = this.callTemplate(
              "taskbar_text",
              start_date.setHours(0),
              end_date.setHours(0),
              task
            );

            if (task.type === "milestone") {
              sideContent.innerHTML = innerHTML;
            } else {
              ztGanttBarTaskContent.innerHTML = innerHTML;
            }
          });

          ztGanttBarsArea.append(ztGanttBarTask);

          rowCount += 1;
        }

        // if children exist
        if (
          task?.children?.length &&
          this.isTaskOpened(task.id) &&
          !this.options.splitTask
        ) {
          rowCount = this.createChildTaskBars(
            task.children,
            rowCount,
            ztGanttBarsArea,
            j
          );
        }
      }

      const barsArea = document.getElementById("zt-gantt-bars-area");

      if (barContainer === null) {
        barContainer = document.getElementById("zt-gantt-timeline-data");
      }

      // if barsArea exist then remove barsArea
      if (barsArea && !isFromRender) {
        barsArea.replaceWith(ztGanttBarsArea);
      } else {
        barContainer.append(ztGanttBarsArea);
      }
      if (!isFromRender) {
        // create links if addLinks is true
        let isLinksAreaExist = this.element.querySelector(
          "#zt-gantt-links-area"
        );
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

    /**
     * Method to get the start and end dates of a week.
     * @param {Date} weekDate - Any date within the week for which you want the start and end dates.
     * @returns {{ start: Date, end: Date }} - The start and end dates of the week.
     */
    getWeekStartEndDate(weekDate) {
      const date = new Date(weekDate);

      const dayOfWeek = date.getDay();
      const diffToStart = (dayOfWeek + 7 - this.options.weekStart) % 7;

      // Calculate the start date of the week
      const startDate = new Date(date);
      startDate.setDate(date.getDate() - diffToStart);

      // Calculate the end date of the week
      const endDate = new Date(startDate);
      endDate.setDate(startDate.getDate() + 6);

      // Return the start and end dates
      return { startDate, endDate };
    }

    // Method to add click listner
    addClickListener(element, callback) {
      element.addEventListener("click", callback);
    }

    // Method to resize columns
    resizeColumns(
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

        let resizeAreaWidth = headCell.offsetWidth;

        resizeArea.style.width =
          (resizeAreaWidth < (minWidth || 80)
            ? minWidth || 80
            : resizeAreaWidth > maxWidth
            ? maxWidth
            : resizeAreaWidth) + "px";

        that.ztGanttLayout.append(resizeArea);
        document.addEventListener("mousemove", resize, false);
        document.addEventListener("mouseup", handleMouseUp, false);
      }

      function handleMouseUp(e) {
        document.removeEventListener("mousemove", resize, false);
        document.removeEventListener("mouseup", handleMouseUp, false);
        resizeArea.remove();
        if (colResizing) {
          let columns = that.element.querySelectorAll(`[${attr}]`);
          let colWidth = columns[0].offsetWidth + (e.x - startX);
          colWidth =
            colWidth < (minWidth || 80)
              ? minWidth || 80
              : colWidth > maxWidth
              ? maxWidth
              : colWidth;
          for (let col of columns) {
            col.style.width = colWidth + "px";
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
          } else {
            let rightResizer = that.element.querySelector(
              "#zt-gantt-timeline-resizer-wrap"
            );
            headCellContainer.style.width = totalHeadWidth + "px";
            sidebar.style.width = totalHeadWidth + "px";
            sidebar.style.minWidth = totalHeadWidth + "px";
            sidebar.style.width = totalHeadWidth + "px";
            let resizerLeft = sidebar.offsetLeft - rightResizer.offsetLeft;
            rightResizer.style.left =
              rightResizer.offsetLeft + resizerLeft + "px";
            that.options.rightGridWidth = sidebar.offsetWidth;
          }
          // rerender the calendar and scale
          if (
            that.calculateTimeLineWidth("updated") !==
            that.calculateTimeLineWidth("current")
          ) {
            that.updateBody();
          } else {
            that.createScrollbar();
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
    }

    // Method to resize sidebar
    resizeSidebar(resizer, resizerLine, sidebar) {
      let sidebarResizing = false,
        that = this,
        startX,
        sidebarStartWidth;

      resizer.removeEventListener("mousedown", handleMouseDown);
      resizer.addEventListener("mousedown", handleMouseDown);

      function handleMouseDown(event) {
        startX = event.x;
        sidebarStartWidth = sidebar.offsetWidth;
        resizerLine.classList.add("resizing");

        // mouse move event
        document.addEventListener("mousemove", resize, false);
        // mouseup event
        document.addEventListener("mouseup", handleMouseUp, false);
      }

      function handleMouseUp(e) {
        document.removeEventListener("mousemove", resize, false);
        document.removeEventListener("mouseup", handleMouseUp, false);
        if (sidebarResizing) {
          let rightResizer = that.element.querySelector(
            "#zt-gantt-timeline-resizer-wrap"
          );
          // add the all columns minWidth
          const totalMinWidth = that.options.columns.reduce(
            (totalMinWidth, column) => totalMinWidth + column.min_width,
            0
          );

          let left = e.x;
          if (rightResizer) {
            let x = e.x;
            x =
              rightResizer.offsetLeft - 80 <= resizer.offsetLeft
                ? rightResizer.offsetLeft - resizer.offsetLeft
                : 80;

            left = e.x - (80 - x);
          }

          let resizerLeft = 0,
            headerCell = document.getElementsByClassName("head-cell"),
            sidebarData = that.element.querySelector("#zt-gantt-left-grid");

          if (that.element.offsetWidth - left <= 50) {
            left -= 50;
          }

          let singleColIncrease = (left - startX) / that.options.columns.length;

          for (let j = 0; j < headerCell.length; j++) {
            let columns = that.element.querySelectorAll(
              `[data-column-index="${j}"]`
            );

            let incrasedWidth = headerCell[j].offsetWidth + singleColIncrease;

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
          } else {
            that.createScrollbar();
          }
        }
        resizerLine.classList.remove("resizing");
        sidebarResizing = false;
      }

      // resize the sidebar
      function resize(e) {
        sidebarResizing = true;
        let size = sidebarStartWidth + (e.x - startX);
        if (that.element.offsetWidth - size <= 50) return;
        resizer.style.left = `${size}px`;
      }
    }

    // add today flag
    addTodayFlag() {
      // return from here if current date is out of range
      if (this.outOfGanttRange(new Date())) return;

      const isFullWeek = this.options.fullWeek;
      const isWeekend = this.options.weekends.includes(
        this.#dateFormat.day_short[new Date().getDay()]
      );

      if (!isFullWeek && isWeekend) return;

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

        // Calculate the difference in days
        let daysDiff = this.getDates(
          new Date(this.options.startDate),
          new Date()
        );

        daysDiff = daysDiff.length - 1 || 0;

        let colWidth = this.calculateGridWidth(new Date(), "day");
        todayFlag.style.left = colWidth * daysDiff + colWidth / 2 + "px";

        this.markerArea.append(todayFlag);
      }
    }

    // remove today flag
    removeTodayFlag() {
      let today = document.getElementById("zt-gantt-marker-today");
      if (today) {
        today.remove();
      }
    }

    /**
     * Formats a date into the specified format.
     * @param {string} format - The desired format for the date.
     * @param {Date} date - The date to format.
     * @returns {string} The date formatted as a string in the specified format.
     */
    formatDateToString(format, date) {
      const dateFormat = this.#dateFormat;
      date = new Date(date);

      return format.replace(/%[a-zA-Z]/g, (format) => {
        switch (format) {
          case "%d":
            return toFixed(date.getDate());
          case "%m":
            return toFixed(date.getMonth() + 1);
          case "%q":
            return this.getQuarterOfDate(date);
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
        let n = t.getDay();
        0 === n && (n = 7);
        let i = new Date(t.valueOf());
        i.setDate(t.getDate() + (4 - n));
        let r = i.getFullYear(),
          a = Math.round((i.getTime() - new Date(r, 0, 1).getTime()) / 864e5);
        return 1 + Math.floor(a / 7);
      }
    }

    /**
     * Adds a specified amount of time to a given date.
     * @param {Date} date - The original date.
     * @param {number} amount - The amount of time to add.
     * @param {string} unit - The unit of time to add ('day', 'week', 'month', 'year', 'hour', 'minute').
     * @returns {Date} The new date with the added time.
     */
    add(date, amount, unit) {
      let newDate = new Date(date.valueOf());
      switch (unit) {
        case "day":
          newDate = this._add_days(newDate, amount, date);
          break;
        case "week":
          newDate = this._add_days(newDate, 7 * amount, date);
          break;
        case "month":
          newDate.setMonth(newDate.getMonth() + amount);
          break;
        case "year":
          newDate.setYear(newDate.getFullYear() + amount);
          break;
        case "hour":
          newDate.setTime(newDate.getTime() + 60 * amount * 60 * 1e3);
          break;
        case "minute":
          newDate.setTime(newDate.getTime() + 60 * amount * 1e3);
          break;
        default:
          return this["add_" + unit](date, amount, unit);
      }
      return newDate;
    }

    // add days in date
    _add_days(t, e, n) {
      t.setDate(t.getDate() + e);
      let i = e >= 0,
        r = !n.getHours() && t.getHours(),
        a =
          t.getDate() <= n.getDate() ||
          t.getMonth() < n.getMonth() ||
          t.getFullYear() < n.getFullYear();
      return (
        i && r && a && t.setTime(t.getTime() + 36e5 * (24 - t.getHours())), t
      );
    }

    // Function to strip time from date
    stripTime(date) {
      const dateOnly = new Date(date);
      dateOnly.setHours(0, 0, 0, 0);
      return dateOnly;
    }

    // request browser fullscreen
    requestFullScreen() {
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
      let isVerScrollExist = this.element.querySelectorAll(
        ".zt-gantt-ver-scroll-cell"
      );
      if (isVerScrollExist && isVerScrollExist.length > 0) {
        for (let scroll of isVerScrollExist) {
          scroll.remove();
        }
      }

      this.dispatchEvent("onRequestFullScreen", { type: "requestFullScreen" });

      if (
        this.calculateTimeLineWidth("updated") !==
        this.calculateTimeLineWidth("current")
      ) {
        this.updateBody();
      } else {
        let verScroll =
          this.element.querySelector(".zt-gantt-ver-scroll")?.scrollTop || 0;
        let horScroll =
          this.element.querySelector(".zt-gantt-hor-scroll")?.scrollLeft || 0;
        this.createScrollbar(verScroll, horScroll);
      }
      resizer.style.left = sidebar.offsetWidth + "px";
    }

    // exit browser fullscreen
    exitFullScreen(listener = false) {
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

      let isVerScrollExist = this.element.querySelectorAll(
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
        setTimeout(() => {
          this.updateBody();
        }, 0);
      } else {
        this.createScrollbar();
      }

      // manage tooltip
      this.hideTooltip();

      // handle custom event
      this.dispatchEvent("onExitFullScreen", { type: "exitFullScreen" });
    }

    /**
     * Method to expand all rows of gantt
     */
    expandAll() {
      const childRows = this.element.querySelectorAll(".zt-gantt-child-row");
      const toggleIcons = this.element.querySelectorAll(".zt-gantt-tree-close");

      for (let icon of toggleIcons) {
        icon.classList.remove("zt-gantt-tree-close");
        icon.classList.add("zt-gantt-tree-open");
      }

      for (let row of childRows) {
        if (row.classList.contains("zt-gantt-d-none")) {
          row.classList.add("zt-gantt-d-flex");
          row.classList.remove("zt-gantt-d-none");
        }
      }

      this.options.openedTasks = this.#originalData.map((task) => task?.id);
      this.createTaskBars();
      this.createScrollbar();
      this.options.collapse = false;
    }

    /**
     * Method to collapse all rows of gantt
     */
    collapseAll() {
      const childRows = this.element.querySelectorAll(".zt-gantt-child-row");
      const toggleIcons = this.element.querySelectorAll(".zt-gantt-tree-icon");

      // Make the opened task array empty
      this.options.openedTasks.length = 0;

      // Change all the toggle icons to close
      for (let icon of toggleIcons) {
        icon.classList.remove("zt-gantt-tree-open");
        icon.classList.add("zt-gantt-tree-close");
      }

      // Hide all the child rows
      for (let row of childRows) {
        row.classList.add("zt-gantt-d-none");
        row.classList.remove("zt-gantt-d-flex");
      }

      // Again create all taskBars
      this.createTaskBars();
      this.createScrollbar();
      this.options.collapse = true;
    }

    // get start and end dates from children array
    getStartAndEndDate(data = this.options.data) {
      const that = this;
      function getDates(array) {
        let dates = [];
        array.forEach((item) => {
          if (Array.isArray(item.children) && item.children.length > 0) {
            dates = dates.concat(getDates(item.children));
          }
          if (
            that.hasProperty(item, "start_date") &&
            that.hasProperty(item, "end_date")
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
    }

    // resize or move Task Bars
    resizeTaskBars(resizer, taskBar, type, task) {
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
        autoScrollTimer,
        autoScrollDelay = 5, // Adjust the scroll delay by changing the value here
        originalTask,
        initStartDate,
        initEndDate,
        scrollSpeed = 5, // Adjust the scroll speed by changing the value here
        willRender = false,
        scrollContainerTop,
        scrollThresholdTop,
        scrollThresholdBottom,
        scrollContainer,
        scrollThresholdRight,
        scrollThresholdLeft,
        allTaskbars;

      const timelineCellWidth = this.calculateGridWidth(task.start_date, "day");

      resizer.removeEventListener("mousedown", handleMouseDown);
      resizer.addEventListener("mousedown", handleMouseDown);

      function handleMouseDown(event) {
        rightPanelScroll = document.getElementById("zt-gantt-timeline-cell");
        rightPanelScrollWidth = rightPanelScroll.scrollWidth;
        allTaskbars = that.element.querySelectorAll(".zt-gantt-bar-task");

        scrollContainerTop =
          that.element.offsetTop + rightPanelScroll.offsetHeight;
        scrollThresholdTop = scrollContainerTop - 30;
        scrollThresholdBottom =
          that.element.offsetTop + that.calculateScaleHeight("scroll") + 30;

        scrollContainer = that.element.offsetLeft + rightPanelScroll.offsetLeft;
        scrollThresholdRight =
          scrollContainer + rightPanelScroll.offsetWidth - 30;
        scrollThresholdLeft = scrollContainer + 30;

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

      function handleMouseUp() {
        autoScroll = false;
        taskBar.classList.remove("task-dragging");
        document.removeEventListener("mousemove", resize, false);
        document.removeEventListener("mouseup", handleMouseUp, false);

        if (resizeTask === true) {
          let parentTask;
          const taskbarIndex = Math.floor(
            taskBar.offsetTop / that.options.row_height
          );
          const currentPosTaskbar = allTaskbars[taskbarIndex];
          const isTaskbarIndexInRange =
            taskbarIndex > -1 && taskbarIndex < allTaskbars.length;
          const taskParentId = currentPosTaskbar?.getAttribute("task-parent");
          const taskPosition =
            +currentPosTaskbar?.getAttribute("data-task-pos");
          const taskPositionId = currentPosTaskbar?.getAttribute(
            "zt-gantt-taskbar-id"
          );
          const currentTaskParentId = taskBar.getAttribute("task-parent");
          const currentTaskPosition = +taskBar.getAttribute("data-task-pos");

          const updateData = (parentId, task, taskPositionId) => {
            let currentIndex = that.#originalData.findIndex(
              (obj) => obj.id == task.id
            );
            let newIndexTask = that.getTask(taskPositionId);
            let newIndex = that.#originalData.findIndex(
              (obj) => obj.id == taskPositionId
            );

            that.#originalData.splice(currentIndex, 1); // Remove the object from the current position
            task.parent =
              parentId.length > 1 ? newIndexTask.parent : newIndexTask.id;
            that.#originalData.splice(newIndex, 0, task); // Insert the object at the new position
          };

          if (isTaskbarIndexInRange) {
            let currentTask = that.getTask(taskPositionId);
            const parentId =
              taskParentId.length > 1 ? currentTask.parent : currentTask.id;
            parentTask = that.getTask(parentId);
          } else {
            parentTask = null;
          }

          // handle custom event
          that.dispatchEvent("onBeforeTaskDrop", {
            task,
            mode: type === "move" ? "move" : "resize",
            parentTask: parentTask,
            oldParentTask: that.getTask(task.parent),
          });

          if (type === "move" && that.#eventValue === false) {
            taskBar.style.top = `${startTop}px`;
            taskBar.style.left = `${startLeft}px`;
            resizer.style.cursor = "pointer";
            that.#updateTask(task, initStartDate, initEndDate, taskBar);
            resizeTask = false;
            that.#eventValue = true;
          } else {
            if (type === "move") {
              resizer.style.cursor = "pointer";

              // if current task position or task parent is not same
              // update the task position in array
              if (
                (taskParentId !== currentTaskParentId ||
                  taskPosition !== currentTaskPosition) &&
                isTaskbarIndexInRange &&
                taskParentId !==
                  currentTaskParentId.slice(
                    0,
                    currentTaskParentId.length - 1
                  ) &&
                !that.options.splitTask
              ) {
                updateData(taskParentId, task, taskPositionId);
                willRender = true;
              } else {
                taskBar.style.top = `${startTop}px`;
              }
            }

            const gridWidth = that.calculateGridWidth(
              task.start_date,
              that.options.zoomLevel !== "hour" ? "day" : ""
            );

            // set the left and width to whole column
            taskBar.style.left =
              Math.round(taskBar.offsetLeft / gridWidth) * gridWidth + "px";
            if (type !== "move") {
              taskBar.style.width =
                Math.round(taskBar.offsetWidth / gridWidth) * gridWidth + "px";
            }
          }
          if (task.type === "milestone") {
            task.end_date = new Date(task.start_date).setHours(23, 59, 59);
          }

          that.#updateTask(
            task,
            task.start_date,
            task.end_date,
            taskBar,
            "mouseup"
          );

          if (willRender) {
            // render the chart again
            that.render();
            willRender = false;
          }

          // handle custom event
          that.dispatchEvent("onAfterTaskDrag", {
            task,
            mode: type === "move" ? "move" : "resize",
            parentTask: that.getTask(task.parent),
          });
        }
        resizeTask = false;
      }

      // resize the taskBar
      function resize(e) {
        if (resizeTask === false) {
          // custom event handler
          that.dispatchEvent("onBeforeTaskDrag", {
            task,
            mode: type === "move" ? "move" : "resize",
          });
        }

        // if onBeforeTaskDrag return false then do not drag the task
        if (that.#eventValue === false) {
          return;
        }

        resizeTask = true;

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
            if (autoScrollTimer) {
              clearInterval(autoScrollTimer);
            }
            autoScrollTimer = setTimeout(() => {
              startAutoScroll(type);
            }, autoScrollDelay);
          }
        }

        // auto scroll the timeline left or right
        if (e.clientX > scrollThresholdRight - window.scrollX) {
          autoScroll = true;
          startAutoScroll("right");
        } else if (e.clientX < scrollThresholdLeft - window.scrollX) {
          autoScroll = true;
          startAutoScroll("left");
        } else {
          autoScroll = false;
        }

        // auto scroll the timeline top or bottom
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

          taskBar.style.left = `${left}px`;
          if (!that.options.splitTask) {
            taskBar.style.top = `${
              startTop +
              (e.y - startY) -
              (startRightPanelScrollTop - rightPanelScroll.scrollTop)
            }px`;
          }
          taskBar.classList.add("task-dragging");

          if (that.options.dropArea) {
            const taskbarIndex = Math.floor(
              taskBar.offsetTop / that.options.row_height
            );
            const currentPosTaskbar = allTaskbars[taskbarIndex];
            const isTaskbarIndexInRange =
              taskbarIndex > -1 && taskbarIndex < allTaskbars.length;
            if (isTaskbarIndexInRange) {
              const taskPos = currentPosTaskbar.getAttribute("task-parent");
              const pos = taskPos?.slice(0, -1) || taskPos;
              const rows = that.element.querySelectorAll(
                `[zt-gantt-data-task-id^="${pos}"].zt-gantt-task-row`
              );
              const dropAreaHeight =
                rows[rows.length - 1].offsetTop -
                rows[0].offsetTop +
                that.options.row_height;
              const dropArea = that.element.querySelector(".drop-area");
              dropArea.style.top = `${rows[0].offsetTop}px`;
              dropArea.style.height = `${dropAreaHeight}px`;
            }
          }

          const taskbarOffsetLeft = taskBar.offsetLeft;
          const taskbarOffsetWith = taskBar.offsetWidth;

          let taskStartDate =
            that.dates[
              Math.round(taskbarOffsetLeft / timelineCellWidth) -
                (task.type === "milestone" ? 1 : 0)
            ];

          let taskEndDate =
            that.dates[
              Math.round(
                (taskbarOffsetLeft + taskbarOffsetWith) / timelineCellWidth
              ) - 1
            ];

          // if taskStartDate is less than the gantt range
          if (!taskStartDate) {
            let dateDiff = Math.round(taskbarOffsetLeft / timelineCellWidth);
            taskStartDate = that.add(new Date(that.dates[0]), dateDiff, "day");
          }

          // if taskEndDate is greater than the gantt range
          if (!taskEndDate) {
            let dateDiff =
              Math.round(
                (taskbarOffsetLeft + taskbarOffsetWith) /
                  that.calculateGridWidth(task.start_date)
              ) - that.dates.length;

            taskEndDate = that.add(
              new Date(that.dates[that.dates.length - 1]),
              dateDiff,
              "day"
            );
          }

          // emmit event of moveTask
          that.dispatchEvent("onTaskDrag", {
            originalTask,
            task,
            mode: "move",
          });

          that.#updateTask(
            task,
            new Date(taskStartDate),
            new Date(taskEndDate),
            taskBar
          );
          return;
        }

        // drag taskbar left or right

        let size, left;

        if (type === "left") {
          size =
            startWidth -
            (e.x - startX) +
            (startRightPanelScrollLeft - rightPanelScroll.scrollLeft);
          left =
            startLeft +
            (e.x - startX) -
            (startRightPanelScrollLeft - rightPanelScroll.scrollLeft);
          if (size <= timelineCellWidth || left <= 0) {
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
            size <= timelineCellWidth ||
            taskBar.offsetLeft + size >= rightPanelScrollWidth
          ) {
            return;
          } else {
            taskBar.style.width = size + "px";
          }
        }

        const taskbarOffsetLeft = taskBar.offsetLeft;
        const taskbarOffsetWith = taskBar.offsetWidth;

        let taskStartDate =
          that.dates[Math.round((taskbarOffsetLeft + 1) / timelineCellWidth)];

        let taskEndDate =
          that.dates[
            Math.round(
              (taskbarOffsetLeft + taskbarOffsetWith) / timelineCellWidth
            ) - 1
          ];

        // emmit the dragTask event
        that.dispatchEvent("onTaskDrag", {
          originalTask,
          task,
          mode: "resize",
        });

        // if taskStartDate is less than the gantt range
        if (!taskStartDate) {
          let dateDiff =
            Math.round(taskbarOffsetLeft / timelineCellWidth) -
            that.dates.length;
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
              (taskbarOffsetLeft + taskbarOffsetWith) / timelineCellWidth
            ) - that.dates.length;
          taskEndDate = that.add(
            new Date(that.dates[that.dates.length - 1]),
            dateDiff,
            "day"
          );
        }

        if (task.type === "milestone") {
          taskEndDate = new Date(taskStartDate).setHours(23, 59, 59);
        }
        that.#updateTask(
          task,
          new Date(taskStartDate),
          new Date(taskEndDate),
          taskBar
        );
      }
    }

    /**
     * Method to update task position on the UI and update the task in data.
     * @param {*} task - task object which need to update.
     * @param {*} start - updated start date of the task.
     * @param {*} end updated end date of the task.
     * @param {*} target HTML element of the taskbar.
     * @param {*} eventType event type mousemove | mouseup
     */
    #updateTask(task, start, end, target, eventType = "mousemove") {
      const timelineCellWidth = this.calculateGridWidth(start, "day");
      const targetOffsetLeft = target.offsetLeft;
      const targetOffsetWidth = target.offsetWidth;
      start = new Date(start);
      end = new Date(end);

      // get the current start and end date of the taskbar
      let taskCurrentStart = new Date(
        this.dates[Math.floor(targetOffsetLeft / timelineCellWidth)]
      );

      let taskCurrentEnd = new Date(
        this.dates[
          Math.floor(
            (targetOffsetLeft + targetOffsetWidth - 1) / timelineCellWidth
          )
        ]
      );

      let startTimePixel = Math.round(targetOffsetLeft % timelineCellWidth);
      let startDateTime = this.getTimeByPx(startTimePixel, start);

      taskCurrentStart = new Date(taskCurrentStart);
      taskCurrentStart.setHours(startDateTime.hours, startDateTime.minutes);

      let endTimePixel = Math.round(
        (targetOffsetLeft + targetOffsetWidth - 1) % timelineCellWidth
      );

      let endDateTime = this.getTimeByPx(endTimePixel, end);

      taskCurrentEnd = new Date(taskCurrentEnd);
      taskCurrentEnd.setHours(endDateTime.hours, endDateTime.minutes);

      // update the task content innerHTML
      if (task.type === "milestone") {
        target.querySelector(".zt-gantt-side-content").innerHTML =
          this.callTemplate("taskbar_text", start, end, task);
      } else {
        target.querySelector(".zt-gantt-bar-task-content").innerHTML =
          this.callTemplate(
            "taskbar_text",
            taskCurrentStart,
            taskCurrentEnd,
            task
          );
      }

      if (this.options.zoomLevel === "hour") {
        const timelineCellStartWidth = this.calculateGridWidth(
          task.start_date,
          "day"
        );
        const timelineCellEndWidth = this.calculateGridWidth(
          task.end_date,
          "day"
        );

        let taskLeft = Math.floor(
          (targetOffsetLeft + 1) / timelineCellStartWidth
        );

        start = this.dates[taskLeft];
        let extraStartPX =
          targetOffsetLeft + 1 - taskLeft * timelineCellStartWidth;

        let taskStartTime = this.getTimeByPx(extraStartPX, new Date(start));
        start = new Date(new Date(start).setHours(taskStartTime.hours));

        let taskLeftAndWidth = Math.floor(
          (targetOffsetLeft + targetOffsetWidth) / timelineCellEndWidth
        );

        end = this.dates[taskLeftAndWidth];
        let extraEndPX =
          targetOffsetLeft +
          targetOffsetWidth +
          1 -
          taskLeftAndWidth * timelineCellEndWidth;

        let taskEndTime = this.getTimeByPx(extraEndPX, new Date(end));
        end = new Date(new Date(end).setHours(taskEndTime.hours - 1));
      }

      this.updateTaskDate(task, start, end);
      this.updateTaskDuration();

      if (target.classList.contains("zt-gantt-bar-parent-task")) {
        return;
      }

      let that = this;
      let allParents = target.getAttribute("task-parent").split("");
      let taskData = [...this.options.data];
      const cellStartDate = this.options.startDate;

      updateAllParents(taskData, allParents, eventType);

      function updateAllParents(data, allParents, eventType) {
        let currentLevel = data;
        let currentParentSelector = allParents[0];

        for (let i = 0; i < allParents.length - 1; i++) {
          const currentTask = currentLevel[allParents[i]];
          currentLevel = currentTask.children;
          const currentParent = that.element.querySelector(
            `[task-parent="${currentParentSelector}"]`
          );

          currentParentSelector = `${currentParentSelector}${
            allParents[i + 1]
          }`;

          if (!currentLevel?.length || !currentParent) continue;

          let { start_date, end_date } = that.getLargeAndSmallDate(currentTask);
          const timelineCellStartWidth = that.calculateGridWidth(
            taskCurrentStart,
            "day"
          );
          const timelineCellEndWidth = that.calculateGridWidth(
            taskCurrentEnd,
            "day"
          );
          const currentParentLeft = currentParent.offsetLeft;

          const cellBefore = that.getDates(cellStartDate, new Date(start_date));

          if (currentParent) {
            // update parent inner html
            if (currentTask.type === "milestone") {
              const beforeDay = Math.floor(
                currentParentLeft / timelineCellStartWidth
              );

              if (currentParentLeft < 0) {
                start_date = that.add(
                  new Date(that.options.startDate),
                  beforeDay,
                  "day"
                );
              } else {
                start_date = new Date(that.dates[beforeDay]);
              }

              end_date = new Date(new Date(start_date).setHours(23, 59, 59));

              currentParent.querySelector(".zt-gantt-side-content").innerHTML =
                that.callTemplate(
                  "taskbar_text",
                  start_date,
                  end_date,
                  currentTask
                );
            } else {
              // find All childs of current parent
              let allChildsLeft = [];
              let allChildsLeftAndWidth = [];

              currentLevel.forEach((task) => {
                let childTaskBar = that.element.querySelector(
                  `[zt-gantt-taskbar-id="${task.id}"]`
                );
                if (childTaskBar) {
                  const childTaskBarLeft =
                    childTaskBar.offsetLeft -
                    (task.type === "milestone" ? 9 : 0);
                  allChildsLeft.push(childTaskBarLeft);
                  allChildsLeftAndWidth.push(
                    childTaskBarLeft + childTaskBar.offsetWidth
                  );
                }
              });

              // if parent has startdate and end date
              if (
                that.hasProperty(currentTask, "start_date") ||
                that.hasProperty(currentTask, "end_date")
              ) {
                let cellBefore = that.getDates(
                  cellStartDate,
                  new Date(currentTask.start_date)
                );

                let taskDates = that.getDates(
                  currentTask.start_date,
                  new Date(currentTask.end_date)
                );

                if (cellBefore.length === 0) {
                  cellBefore = that.getDates(
                    currentTask.start_date,
                    cellStartDate
                  );
                  cellBefore = -(cellBefore.length - 1);
                } else {
                  cellBefore = cellBefore.length - 1;
                }

                const timelineCellWidth = that.calculateGridWidth(
                  start_date,
                  "day"
                );
                const taskbarLeft = cellBefore * timelineCellWidth;

                if (currentTask.start_date) {
                  allChildsLeft.push(taskbarLeft);
                }

                if (currentTask.end_date) {
                  allChildsLeftAndWidth.push(
                    taskbarLeft + taskDates.length * timelineCellWidth
                  );
                }
              }

              let parentLeft = Math.min(...allChildsLeft);
              let parentWidth = Math.max(...allChildsLeftAndWidth) - parentLeft;

              if (eventType === "mouseup") {
                const gridWidth = that.calculateGridWidth(
                  task.start_date,
                  that.options.zoomLevel !== "hour" ? "day" : ""
                );
                parentLeft = Math.round(parentLeft / gridWidth) * gridWidth;
                parentWidth = Math.round(parentWidth / gridWidth) * gridWidth;
              }

              const beforeDay = Math.floor(parentLeft / timelineCellStartWidth);

              if (cellBefore.length === 0) {
                start_date = that.add(
                  new Date(cellStartDate),
                  beforeDay,
                  "day"
                );
              } else {
                start_date = new Date(that.dates[beforeDay]);
              }

              const afterDay = Math.floor(
                (parentLeft + parentWidth) / timelineCellEndWidth
              );

              if (afterDay > that.dates.length) {
                end_date = that.add(
                  new Date(that.options.endDate),
                  afterDay - that.dates.length,
                  "day"
                );
              } else {
                let dateIndex = Math.floor(
                  (parentLeft + parentWidth) / timelineCellEndWidth
                );

                end_date = new Date(that.dates[dateIndex - 1]);
              }

              currentParent.querySelector(
                ".zt-gantt-bar-task-content"
              ).innerHTML = that.callTemplate(
                "taskbar_text",
                start_date,
                end_date,
                currentTask
              );

              if (
                parentWidth < timelineCellEndWidth &&
                task.type === "milestone"
              ) {
                parentLeft =
                  that.posFromDate(
                    eventType === "mouseup" ? start : taskCurrentStart
                  ) -
                  (eventType !== "mouseup"
                    ? timelineCellEndWidth - targetOffsetWidth
                    : 0);
                parentWidth = timelineCellEndWidth;
              }

              currentParent.style.left = `${parentLeft}px`;
              currentParent.style.width = `${parentWidth}px`;
            }
          }
        }
      }
    }

    /**
     * Method to update task start_date and end_date
     * @param {*} task - task
     * @param {*} start - start_date
     * @param {*} end  - end_date
     */
    updateTaskDate(task, start, end) {
      task.start_date = start;
      task.end_date = end;
      this.#originalData.findIndex((item) => {
        if (item.id == task.id) {
          item.start_date = start;
          item.end_date = end;
        }
      });
    }

    /**
     * Initializes the column sizes based on the given unit, step, and date.
     * @param {string} unit - The unit of time (e.g., "hour", "day", "week", "month", "quarter", "year").
     * @param {number} step - The step value for the unit.
     * @param {Date} date - The reference date.
     * @returns {{ startDate: Date, endDate: Date, dateCount: number }} - The start date, end date, and count of dates within the range.
     */
    initColSizes(unit, step, date) {
      let startDate, endDate, dateYear;

      // Determine the start and end dates based on the unit
      switch (unit) {
        case "hour":
          // If unit is hour
          startDate = new Date(date);
          endDate = new Date(date);
          break;
        case "day":
          // If unit is day
          startDate = new Date(date);
          endDate = new Date(date);
          break;
        case "week":
          // If unit is week
          ({ startDate, endDate } = this.getWeekStartEndDate(date));
          break;
        case "month":
          // If unit is month
          ({ startDate, endDate } = this.getMonthStartEndDate(date));
          break;
        case "quarter":
          // If unit is quarter
          ({ startDate, endDate } = this.getQuarterStartEndDate(date));
          break;
        case "year":
          // If unit is year
          dateYear = new Date(date).getFullYear();
          startDate = new Date(dateYear, 0, 1);
          endDate = new Date(dateYear, 11, 31);
          break;
        default:
          // Handle invalid unit
          this.toastr("Error", `Invalid scale unit: ${unit}`, "error");
          return;
      }

      if (step > 1) {
        endDate = this.add(endDate, step - 1, unit);
      }

      const rangeStart = this.stripTime(this.options.startDate).getTime();
      const rangeEnd = this.stripTime(this.options.endDate).getTime();

      const dateCount =
        this.getDates(startDate, endDate).filter((date) => {
          const dateToCheck = new Date(date).setHours(0, 0, 0, 0);
          return dateToCheck >= rangeStart && dateToCheck <= rangeEnd;
        })?.length || 0;

      return {
        startDate,
        endDate,
        dateCount,
      };
    }

    /**
     * Get the start and end dates of the month for a given date.
     * @param {Date|string} date - The date for which to find the month's start and end dates.
     * @returns {{startDate: Date, endDate: Date}} - The start and end dates of the month.
     */
    getMonthStartEndDate(date) {
      date = new Date(date); // date for which we find month start and month end
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Add 1 because getMonth() returns 0-indexed months
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      return {
        startDate,
        endDate,
      };
    }

    /**
     * Get the start and end dates of the quarter for a given date.
     * @param {Date|string} dateString - The date for which to find the quarter's start and end dates.
     * @returns {{startDate: Date, endDate: Date}} - The start and end dates of the quarter.
     */
    getQuarterStartEndDate(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth();

      const quarterStartMonth = Math.floor(month / 3) * 3;
      const startDate = new Date(year, quarterStartMonth, 1);
      const endDate = new Date(year, quarterStartMonth + 3, 0);

      return {
        startDate,
        endDate,
      };
    }

    /**
     * Calculates the timeline scale height.
     * @param { string } type - The type of scale ("header" or "scroll" or "body").
     * @param { number } [i=0] - The index for individual scale heights.
     * @returns { string | number } - The calculated height as a string with 'px' for header, or a number for scroll.
     */
    calculateScaleHeight(type, i = 0) {
      const scales = this.options.scales;
      const scaleHeight = this.options.scale_height;

      if (type === "header" || type === "scroll") {
        let height;

        if (Array.isArray(scaleHeight)) {
          height = scaleHeight.reduce(
            (totalHeight, height) => totalHeight + height,
            0
          );

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
    }

    /**
     * Method to get the timeline cell width based on date and zoom level.
     * @param {Date} date - date of the cell.
     * @param {string} levelType - zoom level of the cell.
     * @returns {Number} returns the timeline single grid cell width.
     */
    calculateGridWidth(date = new Date(0), levelType = this.options.zoomLevel) {
      let sidebar = document.getElementById("zt-gantt-grid-left-data");
      const totalWidth = this.options.columns.reduce(
        (totalWidth, col) => totalWidth + col.width,
        0
      );

      let sidebarWidth = 0;
      if (sidebar) {
        let headCell = this.element.querySelectorAll(".head-cell");
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

      if (
        sidebar?.offsetHeight < sidebar?.scrollHeight ||
        this.#ganttHeight > this.element.offsetHeight
      ) {
        elementWidth -= 22;
      } else {
        elementWidth -= sidebar?.offsetHeight ? 2 : 0;
      }

      let minWidth = this.options.minColWidth;
      const colCount = this.dates.length;

      const date0 = new Date(0);

      const level = date !== date0 ? this.options.zoomLevel : "day";

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
          minWidth;
          break;
      }
      const gridWidth = Math.max(
        elementWidth /
          (level === "hour" && levelType !== "day" ? colCount * 24 : colCount),
        minWidth
      );
      return gridWidth;
    }

    calculateTimeLineWidth(type, levelType = this.options.zoomLevel) {
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
              totalWidth += cellWidth * colDates.dateCount;
              endDate = colDates.endDate;
            }
          }
        } else {
          totalWidth =
            this.calculateGridWidth(new Date(0), levelType) * this.dates.length;
        }
      } else {
        let timeLineRow = this.element.querySelector(".zt-gantt-task-row");
        let timeLineCell = timeLineRow.querySelectorAll(".zt-gantt-task-cell");
        totalWidth = Array.from(timeLineCell).reduce(
          (totalWidth, cell) => totalWidth + cell.offsetWidth,
          0
        );
      }
      return totalWidth;
    }

    // create lightbox
    createLightbox() {
      if (this.lightbox) return;

      const lightbox = document.createElement("div");
      const lightboxBackdrop = document.createElement("div");

      this.lightbox = {
        lightbox,
        lightboxBackdrop,
      };

      lightbox.style.display = "none";
      lightboxBackdrop.style.display = "none";

      lightbox.classList.add("zt-gantt-lightbox");
      lightbox.id = "zt-gantt-lightbox";
      lightboxBackdrop.classList.add("zt-gantt-lightbox-backdrop");
      lightboxBackdrop.id = "zt-gantt-lightbox-backdrop";
      lightbox.setAttribute("role", "dialog");

      document.body.append(lightboxBackdrop);
      document.body.append(lightbox);
    }

    // show lightbox
    showLightBox(task) {
      if (!this.lightbox) return;

      const { lightbox, lightboxBackdrop } = this.lightbox;

      lightbox.innerHTML =
        this.callTemplate("showLightBox", task) ||
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

      lightbox.style.display = "block";
      lightboxBackdrop.style.display = "block";

      if (
        !this.templates?.showLightBox &&
        !this.isFunction(this.templates?.showLightBox)
      ) {
        const that = this;

        // hide lightbox
        const cancelbtn = document.querySelector("[role=cancel]");

        cancelbtn.addEventListener("click", handleCancelClick);
        function handleCancelClick() {
          that.hideLightbox();
        }

        // delete task
        const deletebtn = document.querySelector("[role=delete]");

        deletebtn.addEventListener("click", handleDeleteClick);
        function handleDeleteClick() {
          that.deleteTask(task.id);
        }

        // update task
        const savebtn = document.querySelector("[role=save]");
        const textarea = document.querySelector("#lightbox-text-area");

        savebtn.addEventListener("click", handleSaveClick);
        function handleSaveClick() {
          task.text = textarea.value;
          that.updateTaskData(task);
        }
      }
    }

    // hide lightbox
    hideLightbox() {
      if (!this.lightbox) return;
      const { lightbox, lightboxBackdrop } = this.lightbox;
      const backdrop = lightboxBackdrop;
      lightbox.style.display = "none";
      backdrop.style.display = "none";
    }

    /**
     * Method to add task in gantt.
     * @param { Task } task - task object
     */
    addTask(task) {
      if (task.id == task.parent) {
        this.toastr(
          "Error",
          "task id and task parent can not be same",
          "error"
        );
      }

      this.#originalData.unshift(task);
      this.eachTask((item) => {
        if (item.id == task.parent) {
          if (!item.children) {
            item.children = [];
          }

          item.children.unshift(task);
        }
      });

      // this.render();
      if (!this.isTaskOpened(task.parent)) {
        this.addTaskToOpenedList(task.parent);
      }

      this.addTaskToOpenedList(task.id);
      this.hideLightbox();
    }

    /**
     * Method to delete a task from gantt.
     * @param { number | string } id - id of the task to delete
     */
    deleteTask(id) {
      for (let i = 0; i < this.#originalData.length; i++) {
        if (this.#originalData[i].id == id) {
          const task = this.getTask(id);
          this.#originalData.splice(i, 1);
          this.render();
          this.hideLightbox();
          this.dispatchEvent("onTaskDelete", { task });
          break;
        }
      }
    }

    /**
     * Method to update task in gantt.
     * @param { Task } task - updated task object.
     */
    updateTaskData(task) {
      const updatedTaskIndex = this.#originalData.findIndex(
        (item) => item.id === task.id
      );

      if (updatedTaskIndex !== -1) {
        this.#originalData[updatedTaskIndex] = {
          ...this.#originalData[updatedTaskIndex],
          ...task,
        };

        this.eachTask((item, parentTask, index) => {
          if (item.id === task.id) {
            parentTask[index] = this.#originalData[updatedTaskIndex];
          }
        });

        this.updateTaskDuration();
        this.hideLightbox();
        this.dispatchEvent("onAfterTaskUpdate", { task });
      }
    }

    // export Gantt as PNG
    exportToPNG(name = "ztGantt", styleSheet) {
      this.getFile(name, "png", styleSheet);
    }

    // export Gantt as PDF
    exportToPDF(name = "ztGantt", styleSheet) {
      this.getFile(name, "pdf", styleSheet);
    }

    /**
     * Method to export Gantt as Excel.
     * @param { string } name - Name of the exported excel file.
     */
    exportToExcel(name = "ztGantt") {
      let csv = "";
      const regexIgnorePattern =
        /<[^>]+?\szt-gantt-ignore=(["'])(true)\1[^>]*>.*?<\/[^>]+?>/g;

      // Function to escape quotes and commas in the CSV content
      function escapeCSV(value) {
        if (typeof value === "string") {
          value = value.replace(regexIgnorePattern, "").replace(/<[^>]*>/g, "");
          if (
            value.includes(",") ||
            value.includes('"') ||
            value.includes("\n")
          ) {
            value = `"${value.replace(/"/g, '""')}"`;
          }
        }
        return value;
      }

      // Create the header row
      let headerRow = this.options.columns
        .map((col) => escapeCSV(col.label))
        .join(",");

      let right = this.options.rightGrid;
      if (right) {
        headerRow += "," + right.map((col) => escapeCSV(col.label)).join(",");
      }

      csv += headerRow + "\n";

      // Call the recursive function to convert data to CSV
      csv += convertToCSV(this.options.data, this.options.columns, right);

      // Recursive function to convert data to CSV
      function convertToCSV(array, columns, right) {
        let csvData = "";

        array.forEach((obj) => {
          let rowData = columns.map((col) => escapeCSV(col.template(obj)));
          if (right) {
            rowData.push(...right.map((col) => escapeCSV(col.template(obj))));
          }
          csvData += rowData.join(",") + "\n";

          if (obj.children && obj.children.length > 0) {
            csvData += convertToCSV(obj.children, columns, right);
          }
        });

        return csvData;
      }

      // Create a download link
      let link = document.createElement("a");
      link.setAttribute(
        "href",
        "data:text/csv;charset=utf-8," + encodeURIComponent(csv)
      );
      link.setAttribute("download", `${name}.csv`);
      // Programmatically trigger the download
      link.click();
      link.remove();
    }

    // Method for calling api
    getFile(filename = "ztGantt", type, styleSheet) {
      const apiUrl = this.options.exportApi;

      if (!this.options.exportApi) {
        this.toastr("Add export url", "Please add an export url!!", "error");
        return;
      }

      const postData = {
        styles: styleSheet,
        content: this.element.outerHTML,
        fileType: type,
        zoom: this.options.zoomLevel,
      };

      const requestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      };
      this.showLoader();

      getFileApiCall();

      const that = this;

      async function getFileApiCall() {
        await fetch(apiUrl, requestOptions)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Network response was not ok");
            }
            return response.json();
          })
          .then((data) => {
            const blob = new Blob([new Uint8Array(data.data.data)], {
              type: "application/pdf",
            });
            that.saveAs(filename, blob, type);
            that.hideLoader();
          })
          .catch((error) => {
            console.error("Fetch error:", error);
            that.toastr("Export Error", error, "error");
            that.hideLoader();
          });
      }
    }

    // Method for saving file
    saveAs(fileName, blob, type) {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName + "." + type;
      link.click();
      URL.revokeObjectURL(url);
    }

    // Method to create sidebar child rows
    createSidebarChild(
      taskData,
      options,
      leftDataContainer,
      nestedLevel,
      parentIdString,
      isRight,
      isOpened
    ) {
      // loop through all the children
      for (let l = 0; l < taskData.length; l++) {
        const task = taskData[l];
        let taskParents = `${parentIdString}${l}`;

        if (!this.isTaskNotInSearchedData(task.id)) {
          if (this.#searchedData) {
            this.addTaskToOpenedList(task.id.id);
          }

          let dataItem = document.createElement("div");
          dataItem.classList.add(
            "zt-gantt-row-item",
            "zt-gantt-child-row",
            `zt-gantt-child-${task.parent}`,
            !isOpened ? "zt-gantt-d-none" : "zt-gantt-d-flex",
            this.options.selectedRow === `${task.id}`
              ? "zt-gantt-selected"
              : "zt-gantt-row-item"
          );

          //add custom classes from user
          const { start_date, end_date } = this.getLargeAndSmallDate(task);
          this.addClassesFromFunction(
            this.templates.grid_row_class,
            dataItem,
            start_date,
            end_date,
            task
          );

          dataItem.setAttribute("zt-gantt-data-task-id", `${taskParents}`);
          dataItem.setAttribute("zt-gantt-task-id", task.id);
          dataItem.style.height = options.row_height + "px";
          dataItem.style.lineHeight = options.row_height + "px";

          const that = this;

          // handle double click event
          dataItem.addEventListener("dblclick", handleDblClick);

          function handleDblClick(e) {
            if (e.target.classList.contains("zt-gantt-tree-icon")) return;

            // custom event handler
            that.dispatchEvent("onBeforeTaskDblClick", { task });

            // if onBeforeTaskDblClick return false then do not drag the task
            if (that.#eventValue === false) {
              that.#eventValue = true;
              return;
            }

            that.dispatchEvent("onTaskDblClick", { task });

            that.showLightBox(task);
          }

          // Handle mouseover event
          dataItem.addEventListener("mouseover", () =>
            this.updateTooltipBody(task)
          );

          // Handle mouseleave event
          dataItem.addEventListener("mouseleave", this.hideTooltip.bind(this));

          this.addClickListener(dataItem, (e) => {
            if (e.target.classList.contains("zt-gantt-tree-icon")) {
              return;
            }
            that.selectTask(task);
          });

          // loop through all the columns
          for (let k = 0; k < options.columns.length; k++) {
            const column = this.options.columns[k];
            let cell = document.createElement("div");
            cell.classList.add("zt-gantt-cell");

            //add custom class from user
            this.addClassesFromFunction(
              this.templates.grid_cell_class,
              cell,
              column,
              task
            );

            cell.style.width = (column.width || 80) + "px";
            column.align ? (cell.style.textAlign = column.align) : "";
            column.align ? (cell.style.justifyContent = column.align) : "";

            let ztGanttBlank = document.createElement("div");
            ztGanttBlank.classList.add("zt-gantt-blank");

            ztGanttBlank.innerHTML = this.callTemplate("grid_blank", task);

            // content
            let content = document.createElement("div");
            content.classList.add(
              "zt-gantt-cell-data",
              "zt-gantt-child-cell",
              `${k == 0 ? "zt-gantt-d-block" : "zt-gantt-child-data"}`
            );
            if (isRight) {
              cell.setAttribute("data-column-index", "r-" + k);
            } else {
              cell.setAttribute("data-column-index", k);
            }
            content.innerHTML =
              column.template(task) || task[column.name] || " ";

            // update content innerHTML on after task update
            this.attachEvent("onAfterTaskUpdate", () => {
              content.innerHTML =
                column.template(task) || task[column.name] || " ";
            });

            // update content innerHTML on after progress drag
            this.attachEvent("onAfterProgressDrag", () => {
              content.innerHTML =
                column.template(task) || task[column.name] || " ";
            });

            // update content innerHTML on task drag
            this.attachEvent("onTaskDrag", () => {
              content.innerHTML =
                column.template(task) || task[column.name] || " ";
            });

            // update content innerHTML on after task drag
            this.attachEvent("onAfterTaskDrag", () => {
              content.innerHTML =
                column.template(task) || task[column.name] || " ";
            });

            if (column.tree) {
              // file icon
              let file = document.createElement("div");
              file.classList.add("zt-gantt-file-icon");
              file.innerHTML = this.callTemplate("grid_file", task);

              //add child indentation
              for (let n = 0; n < nestedLevel; n++) {
                let indent = document.createElement("div");
                indent.classList.add("zt-gantt-indent");
                cell.append(indent);
              }
              cell.classList.add("zt-gantt-d-flex");

              if (task?.children?.length) {
                // tree icon
                let treeIcon = document.createElement("div");
                treeIcon.classList.add(
                  "zt-gantt-tree-icon",
                  !this.isTaskOpened(task.id)
                    ? "zt-gantt-tree-close"
                    : "zt-gantt-tree-open"
                );
                cell.append(treeIcon);

                this.addClickListener(treeIcon, () => {
                  const isTaskCollapse = !this.isTaskOpened(task.id);

                  if (isTaskCollapse) {
                    this.addTaskToOpenedList(task.id);
                  } else {
                    this.removeTaskFromOpenedList(task.id);
                  }

                  this.setCollapseAll(
                    task.children,
                    task.id,
                    isTaskCollapse ? "open" : "collapse"
                  );

                  this.createTaskBars();
                  treeIcon.classList.toggle("zt-gantt-tree-close");
                  treeIcon.classList.toggle("zt-gantt-tree-open");

                  this.createScrollbar();

                  // custom event of toggle tree
                  this.dispatchEvent("onTaskToggle", {
                    task,
                    isTaskOpened: isTaskCollapse,
                  });
                });
              } else {
                cell.append(ztGanttBlank);
              }
              cell.append(file);
            }
            cell.append(content);
            dataItem.append(cell);
            if (column?.editor) {
              cell.addEventListener("click", (e) => {
                if (e.target.classList.contains("zt-gantt-tree-icon")) return;
                this.addInlineEditor(
                  task,
                  column.editor,
                  cell,
                  leftDataContainer
                );
              });
            }
          }

          leftDataContainer.append(dataItem);
        }

        this.createSidebarChild(
          task.children,
          options,
          leftDataContainer,
          nestedLevel + 1,
          taskParents,
          isRight,
          isOpened ? this.isTaskOpened(task.id) : isOpened
        );
      }
    }

    createTimelineChildBody(
      taskData,
      ztGanttTaskData,
      parentIdString,
      isOpened,
      timelineRowTemplate
    ) {
      const options = this.options;

      // loop through all the children
      for (let l = 0; l < taskData.length; l++) {
        const task = taskData[l];
        const taskParents = `${parentIdString}${l}`;

        if (!this.isTaskNotInSearchedData(task.id)) {
          const timelineRow = timelineRowTemplate.cloneNode(true);
          const isRowSelected = options.selectedRow === `${task.id}`;
          const isCollapsed = !this.isTaskOpened(task.parent);

          // Array to hold the classes
          const classes = [
            "zt-gantt-child-row",
            `zt-gantt-child-${task.parent}`,
          ];

          // Conditionally add classes based on `isCollapsed` and `isOpened`
          if (isCollapsed || !isOpened) {
            classes.push("zt-gantt-d-none");
          }

          // Conditionally add the selected class
          if (isRowSelected) {
            classes.push("zt-gantt-selected");
          }

          timelineRow.classList.add(...classes);

          //add custom classes from user
          const { start_date, end_date } = this.getLargeAndSmallDate(task);
          this.addClassesFromFunction(
            this.templates.task_row_class,
            timelineRow,
            start_date,
            end_date,
            task
          );

          timelineRow.setAttribute("zt-gantt-data-task-id", taskParents);
          timelineRow.setAttribute("zt-gantt-task-id", task.id);

          // handle cell click event
          this.addClickListener(timelineRow, (e) => {
            if (e.target.classList.contains("zt-gantt-task-cell")) {
              this.dispatchEvent("onCellClick", {
                task,
                cellDate: e.target.getAttribute("zt-gantt-cell-date"),
              });
            }
          });

          ztGanttTaskData.append(timelineRow);
        }

        // if children exist
        if (task?.children?.length) {
          this.createTimelineChildBody(
            task.children,
            ztGanttTaskData,
            taskParents,
            isOpened ? this.isTaskOpened(task.id) : isOpened,
            timelineRowTemplate
          );
        }
      }
    }

    createChildTaskBars(taskData, rowCount, ztGanttBarsArea, taskParentString) {
      const cellStartDate = this.options.startDate;
      const barTaskHeight = Math.floor((this.options.row_height * 80) / 100);
      // loop through all children
      for (let k = 0; k < taskData.length; k++) {
        const task = taskData[k];
        const taskParents = `${taskParentString}${k}`;

        if (!this.isTaskNotInSearchedData(task.id)) {
          let start_date = task.start_date;
          let end_date = task.end_date || task.start_date;

          if (task?.children?.length) {
            ({ start_date, end_date } = this.getLargeAndSmallDate(task));
          }

          let cellBefore = this.getDates(
            cellStartDate,
            task.type === "milestone" ? task.start_date : start_date
          );

          if (cellBefore.length === 0) {
            cellBefore = this.getDates(start_date, cellStartDate);
            cellBefore = -(cellBefore.length - 1);
          } else {
            cellBefore = cellBefore.length - 1;
          }

          const ztGanttBarTask = document.createElement("div");

          if (task.type === "milestone") {
            ztGanttBarTask.classList.add(
              "zt-gantt-bar-task",
              "zt-gantt-bar-milestone",
              this.options.selectedTask === `${task.id}`
                ? "zt-gantt-selected-task-bar"
                : "zt-gantt-bar-milestone"
            );
          } else {
            ztGanttBarTask.classList.add(
              "zt-gantt-bar-task",
              this.options.selectedTask === `${task.id}`
                ? "zt-gantt-selected-task-bar"
                : "zt-gantt-bar-task"
            );
          }

          if (task.taskColor && task.type !== "milestone") {
            ztGanttBarTask.style.setProperty(
              "background-color",
              this.changeOpacity(task.taskColor),
              "important"
            );
            ztGanttBarTask.style.setProperty(
              "border-color",
              task.taskColor,
              "important"
            );
          }

          //add custom class from user
          this.addClassesFromFunction(
            this.templates.task_class,
            ztGanttBarTask,
            start_date,
            end_date,
            task
          );

          ztGanttBarTask.setAttribute("task-parent", taskParents);
          ztGanttBarTask.setAttribute("data-task-pos", k);
          ztGanttBarTask.setAttribute("zt-gantt-taskbar-id", task.id);

          let taskLeft =
            cellBefore * this.calculateGridWidth(start_date, "day");

          let hourLeft = this.getPxByTime(start_date, "left");
          taskLeft += hourLeft;

          ztGanttBarTask.style.left = taskLeft + "px";

          ztGanttBarTask.style.top =
            rowCount * this.options.row_height +
            Math.floor((this.options.row_height * 10) / 100) +
            "px";
          ztGanttBarTask.style.height = `${barTaskHeight}px`;
          ztGanttBarTask.style.lineHeight = `${barTaskHeight}px`;
          if (task.type === "milestone") {
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

          if (task.type === "milestone" && task.taskColor) {
            ztGanttBarTaskContent.style.setProperty(
              "background-color",
              task.taskColor,
              "important"
            );

            ztGanttBarTaskContent.style.setProperty(
              "border-color",
              task.taskColor,
              "important"
            );
          }

          let that = this;

          // handle double click event
          ztGanttBarTask.addEventListener("dblclick", handleDblClick);

          function handleDblClick() {
            // custom event handler
            that.dispatchEvent("onBeforeTaskDblClick", { task: task });

            // if onBeforeTaskDblClick return false then end here
            if (that.#eventValue === false) {
              that.#eventValue = true;
              return;
            }

            that.dispatchEvent("onTaskDblClick", { task: task });

            that.showLightBox(task);
          }

          const userAgent = navigator.userAgent;

          // Handle mouseover event
          ztGanttBarTask.addEventListener("mouseover", handleMouseOver);

          function handleMouseOver() {
            if (/^((?!chrome|android).)*safari/i.test(userAgent)) {
              ztGanttBarTask.classList.add("hovered");
            }

            that.updateTooltipBody(task);
          }

          // Handle mouseleave event
          ztGanttBarTask.addEventListener("mouseleave", handleMouseLeave);

          function handleMouseLeave() {
            if (/^((?!chrome|android).)*safari/i.test(userAgent)) {
              ztGanttBarTask.classList.remove("hovered");
            }

            that.hideTooltip();
          }

          if (
            this.callTemplate("task_drag", "resize", task) &&
            task.type !== "milestone"
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
              task
            );
            this.resizeTaskBars(
              ztGanttTaskDragRight,
              ztGanttBarTask,
              "right",
              task
            );
          }

          if (this.callTemplate("task_drag", "move", task)) {
            this.resizeTaskBars(
              ztGanttBarTaskContent,
              ztGanttBarTask,
              "move",
              task
            );
          }

          // link control pointers
          const isAddLinks = this.isFunction(this.options.addLinks)
            ? this.options.addLinks(task)
            : this.options.addLinks;

          if (isAddLinks === true) {
            // left point
            const leftLinkPoint = document.createElement("div");
            leftLinkPoint.classList.add(
              "zt-gantt-link-control",
              "zt-gantt-left-point"
            );
            const leftPoint = document.createElement("div");
            leftPoint.classList.add("zt-gantt-link-point");

            // right point
            const rightLinkPoint = document.createElement("div");
            rightLinkPoint.classList.add(
              "zt-gantt-link-control",
              "zt-gantt-right-point"
            );
            const rightPoint = document.createElement("div");
            rightPoint.classList.add("zt-gantt-link-point");

            leftLinkPoint.append(leftPoint);
            rightLinkPoint.append(rightPoint);
            ztGanttBarTask.append(leftLinkPoint, rightLinkPoint);
            this.createNewLink(rightPoint, ztGanttBarTask, task.id, "right");
            this.createNewLink(leftPoint, ztGanttBarTask, task.id, "left");
          }

          let taskProgress;
          const isTaskProgress = this.isFunction(this.options.taskProgress)
            ? this.options.taskProgress(task)
            : this.options.taskProgress;
          if (isTaskProgress === true && task.type !== "milestone") {
            let progressPer = task.progress || 0;
            const taskProgressContainer = document.createElement("div");
            taskProgressContainer.classList.add(
              "zt-gantt-task-progress-wrapper"
            );
            taskProgress = document.createElement("div");
            taskProgress.classList.add("zt-gantt-task-progress");
            taskProgress.style.width = `${
              progressPer > 100 ? 100 : progressPer
            }%`;

            if (task.taskColor) {
              taskProgress.style.setProperty(
                "background-color",
                task.taskColor,
                "important"
              );
            }

            taskProgressContainer.append(taskProgress);

            const taskProgressDrag = document.createElement("div");
            taskProgressDrag.classList.add("zt-gantt-task-progress-drag");
            taskProgressDrag.style.left = `${
              progressPer > 100 ? 100 : progressPer
            }%`;

            // update the task progress onAfterTaskUpdate
            this.attachEvent("onAfterTaskUpdate", () => {
              const progress = progressPer > 100 ? 100 : task.progress || 0;
              taskProgress.style.width = `${progress}%`;
              taskProgressDrag.style.left = `${progress}%`;
            });

            ztGanttBarTask.append(taskProgressContainer, taskProgressDrag);
            this.dragTaskProgress(
              taskProgressDrag,
              taskProgress,
              ztGanttBarTask,
              task
            );
          }

          //add custom task color picker
          let isCustomColor = this.isFunction(this.options.taskColor)
            ? this.options.taskColor(task)
            : this.options.taskColor;

          if (isCustomColor) {
            let colorPicker = document.createElement("div");
            colorPicker.classList.add("zt-gantt-task-color-picker");
            let colorInput = document.createElement("input");
            colorInput.type = "color";

            setTimeout(() => {
              // Determine the background element based on task type
              const backgroundElement =
                task?.type === "milestone"
                  ? ztGanttBarTaskContent
                  : ztGanttBarTask;

              // Get task color or computed background color
              const backgroundColor =
                task?.taskColor ||
                this.rgbaToHex(
                  window
                    .getComputedStyle(backgroundElement)
                    .getPropertyValue("background-color")
                );

              // Set color input value to task color or converted rgba to hex color
              colorInput.value = backgroundColor;
            }, 0);

            colorPicker.append(colorInput);
            ztGanttBarTask.append(colorPicker);

            this.changeTaskbarColor(
              ztGanttBarTask,
              colorInput,
              taskProgress,
              ztGanttBarTaskContent,
              task
            );
          }

          let taskDates = this.getDates(start_date, end_date);

          if (task.type !== "milestone") {
            let taskWidth =
              taskDates.length * this.calculateGridWidth(end_date, "day");

            if (taskWidth === 0 || !taskWidth) {
              ztGanttBarTask.classList.add("zt-gantt-d-none");
            }

            let hourWidth = this.getPxByTime(end_date, "width");
            let hourLeft = this.getPxByTime(start_date, "left");
            hourWidth += hourLeft;
            taskWidth -= hourWidth;

            ztGanttBarTask.style.width = taskWidth + "px";
          }
          start_date = new Date(start_date).setHours(0, 0, 0);
          end_date = new Date(end_date).setHours(0, 0, 0);
          let sideContent;
          const innerHTML = this.callTemplate(
            "taskbar_text",
            new Date(start_date),
            new Date(end_date),
            task
          );
          if (task.type === "milestone") {
            sideContent = document.createElement("div");
            sideContent.classList.add("zt-gantt-side-content");
            sideContent.innerHTML = innerHTML;
            ztGanttBarTask.append(sideContent);
          } else {
            ztGanttBarTaskContent.innerHTML = innerHTML;
          }

          this.attachEvent("onAfterTaskUpdate", () => {
            const innerHTML = this.callTemplate(
              "taskbar_text",
              new Date(start_date),
              new Date(end_date),
              task
            );
            if (task.type === "milestone") {
              sideContent.innerHTML = innerHTML;
            } else {
              ztGanttBarTaskContent.innerHTML = innerHTML;
            }
          });

          ztGanttBarTask.append(ztGanttBarTaskContent);

          ztGanttBarsArea.append(ztGanttBarTask);

          rowCount += 1;
        }

        if (task.children && this.isTaskOpened(task.id)) {
          rowCount = this.createChildTaskBars(
            task.children,
            rowCount,
            ztGanttBarsArea,
            taskParents
          );
        }
      }
      return rowCount;
    }

    /**
     *
     * @param {Array} data - tasks data to be expanded.
     * @param {Array} openedTasks - array of opened tasks.
     * @returns {Array} Array of updated opened tasks.
     */
    setAllExpand(data, openedTasks) {
      for (const item of data) {
        openedTasks.push(item.id);
        if (item?.children?.length) {
          this.setAllExpand(item.children, openedTasks);
        }
      }
      return openedTasks;
    }

    /**
     *
     * @param {Array} data - tasks children data to be collapsed.
     * @param {number | string} parentId - task id which need to be collapsed.
     * @param {string} type - open | collapse.
     */
    setCollapseAll(data, parentId, type) {
      if (!data) return;

      data.forEach((child) => {
        if (child.children && child?.children?.length) {
          const childType =
            this.isTaskOpened(parentId) && type === "open"
              ? "open"
              : "collapse";
          this.setCollapseAll(child.children, child.id, childType);
        }
      });

      const childrenSelector =
        type === "collapse"
          ? `.zt-gantt-child-${parentId}:not(.zt-gantt-d-none)`
          : `.zt-gantt-child-${parentId}.zt-gantt-d-none`;

      const children = this.element.querySelectorAll(childrenSelector);

      Array.from(children).forEach((child) => {
        if (type === "collapse") {
          child.classList.add("zt-gantt-d-none");
        } else if (this.isTaskOpened(parentId)) {
          child.classList.remove("zt-gantt-d-none");
        }
      });
    }

    // create right sidebar
    createRightSidebar(options) {
      const ztGanttLayout = this.ztGanttLayout;
      // sidebar head cells
      const sidebar = document.createElement("div");
      sidebar.classList.add("zt-gantt-right-sidebar-cell");
      sidebar.id = "zt-gantt-grid-right-data";
      let headCellContainer = document.createElement("div");
      headCellContainer.classList.add("right-sidebar-head-cell-container");
      let containerHeight = this.calculateScaleHeight("header");

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
        const column = options.columns[i];
        let headCell = document.createElement("div");
        headCell.classList.add("right-head-cell");

        //add custom class from user
        this.addClassesFromFunction(
          this.templates.grid_header_class,
          headCell,
          column,
          i
        );

        headCell.setAttribute("data-column-index", `r-${i}`);
        headCell.style.width = (column.width || 80) + "px";
        headCell.innerHTML = column.label;
        headCellContainer.append(headCell);
        if (i < options.columns.length) {
          let resizerWrap = document.createElement("div");
          resizerWrap.classList.add("zt-gantt-col-resizer-wrap");
          resizerWrap.id = "zt-gantt-col-resizer-wrap-r-" + i;
          resizerWrap.style.height = this.calculateScaleHeight("header");

          if (column.resize === true) {
            let resizer = document.createElement("div");
            resizer.classList.add("zt-gantt-col-resizer");
            resizerWrap.append(resizer);
            resizerLeft += column.width || 80;
            resizerWrap.style.left = resizerLeft + "px";
            headCellContainer.append(resizerWrap);
            this.resizeColumns(
              resizerWrap,
              `data-column-index="r-${i}"`,
              headCell,
              headCellContainer,
              column.min_width,
              column.max_width,
              i,
              sidebar,
              true
            );
          }
        }
      }

      // data loop of left side
      const leftDataContainer = document.createElement("div");
      leftDataContainer.classList.add("zt-gantt-grid-data");
      leftDataContainer.id = "zt-gantt-left-grid";
      setTimeout(() => {
        leftDataContainer.style.width = sidebar.offsetWidth + "px";
      }, 0);
      // loop through all the data
      for (let j = 0; j < options.data.length; j++) {
        const task = this.options.data[j];
        if (!this.isTaskNotInSearchedData(task.id)) {
          const dataItem = document.createElement("div");
          dataItem.classList.add("zt-gantt-row-item", "zt-gantt-d-flex");

          //add custom classes from user
          const { start_date, end_date } = this.getLargeAndSmallDate(task);
          this.addClassesFromFunction(
            this.templates.grid_row_class,
            dataItem,
            start_date,
            end_date,
            task
          );

          dataItem.setAttribute("zt-gantt-data-task-id", j);
          dataItem.setAttribute("zt-gantt-task-id", task.id);
          dataItem.style.height = options.row_height + "px";
          dataItem.style.lineHeight = options.row_height + "px";
          let that = this;
          // Handle mouseover event
          dataItem.addEventListener("mouseover", () =>
            this.updateTooltipBody(task)
          );

          // Handle mouseleave event
          dataItem.addEventListener("mouseleave", this.hideTooltip.bind(this));

          this.addClickListener(dataItem, (e) => {
            if (e.target.classList.contains("zt-gantt-tree-icon")) {
              return;
            }

            let selectedRows =
              this.element.querySelectorAll(".zt-gantt-selected");
            let selectedTaskBars = this.element.querySelectorAll(
              ".zt-gantt-selected-task-bar"
            );

            for (let item of selectedRows) {
              item.classList.remove("zt-gantt-selected");
            }

            for (let item of selectedTaskBars) {
              item.classList.remove("zt-gantt-selected-task-bar");
            }

            // select the selected task taskBar
            let currentTaskBar = this.element.querySelector(
              `[zt-gantt-taskbar-id="${task.id}"]`
            );
            currentTaskBar.classList.add("zt-gantt-selected-task-bar");

            let taskRow = this.element.querySelectorAll(
              `[zt-gantt-data-task-id="${j}"]`
            );
            for (let item of taskRow) {
              item.classList.add("zt-gantt-selected");
            }
            that.options.selectedRow = `${task.id}`;
            that.options.selectedTask = `${task.id}`;
          });

          // loop through all the columns
          for (let k = 0; k < options.columns.length; k++) {
            const column = this.options.columns[k];
            let cell = document.createElement("div");
            cell.classList.add("zt-gantt-cell");

            //add custom class from user
            this.addClassesFromFunction(
              this.templates.grid_cell_class,
              cell,
              column,
              task
            );

            cell.style.width = (column.width || 80) + "px";
            column.align ? (cell.style.textAlign = column.align) : "";
            column.align ? (cell.style.justifyContent = column.align) : "";

            let content = document.createElement("div");
            content.classList.add(
              "zt-gantt-cell-data",
              `${k == 0 ? "zt-gantt-d-block" : "zt-gantt-data"}`
            );
            cell.setAttribute("data-column-index", `r-${k}`);

            let ztGanttBlank = document.createElement("div");
            ztGanttBlank.classList.add("zt-gantt-blank");

            ztGanttBlank.innerHTML = this.callTemplate("grid_blank", task);

            // content
            content.innerHTML =
              column.template(task) || task[column.name] || " ";

            if (column.tree) {
              cell.classList.add("zt-gantt-d-flex");

              // folder icon
              let folderIcon = document.createElement("div");
              folderIcon.classList.add("zt-gantt-folder-icon");

              folderIcon.innerHTML = this.callTemplate("grid_folder", task);

              if (task.children && task.children.length > 0) {
                // tree icon
                let treeIcon = document.createElement("div");
                treeIcon.classList.add(
                  "zt-gantt-tree-icon",
                  !this.isTaskOpened(task.id)
                    ? "zt-gantt-tree-close"
                    : "zt-gantt-tree-open"
                );
                treeIcon.id = `toggle-tree-${j}`;
                cell.append(treeIcon);
                // toggle children
                this.addClickListener(treeIcon, () => {
                  const isTaskCollapse = !this.isTaskOpened(task.id);

                  if (isTaskCollapse) {
                    this.addTaskToOpenedList(task.id);
                  } else {
                    this.removeTaskFromOpenedList(task.id);
                  }

                  this.setCollapseAll(
                    task.children,
                    task.id,
                    isTaskCollapse ? "open" : "collapse"
                  );

                  this.createTaskBars();

                  treeIcon.classList.toggle("zt-gantt-tree-close");
                  treeIcon.classList.toggle("zt-gantt-tree-open");

                  // custom event of toggle tree
                  this.dispatchEvent("onTaskToggle", {
                    task,
                    isTaskOpened: isTaskCollapse,
                  });
                });
              } else {
                cell.append(ztGanttBlank);
              }
              cell.append(folderIcon);
            }
            cell.append(content);
            dataItem.append(cell);
          }

          leftDataContainer.append(dataItem);
        }

        this.createSidebarChild(
          task.children,
          options,
          leftDataContainer,
          1,
          j,
          true,
          this.isTaskOpened(task.id)
        );
      }
      sidebar.append(leftDataContainer);

      let timelineResizerWrap = document.createElement("div");
      timelineResizerWrap.classList.add("zt-gantt-timeline-resizer-wrap");
      timelineResizerWrap.id = "zt-gantt-timeline-resizer-wrap";

      let timelineResizer = document.createElement("div");
      timelineResizer.classList.add("zt-gantt-timeline-resizer");
      timelineResizerWrap.append(timelineResizer);
      setTimeout(() => {
        timelineResizerWrap.style.left = sidebar.offsetLeft + "px";
      }, 0);
      ztGanttLayout.append(timelineResizerWrap);
      this.resizeTimeline(timelineResizerWrap, timelineResizer, options);
      ztGanttLayout.append(sidebar);
    }

    /**
     *
     * @param {number} verScrollPos - vertical scrollbar position if it exist.
     * @param {number} horScrollPos - horizontal scrollbar position if it exist.
     */
    createScrollbar(verScrollPos = 0, horScrollPos = 0) {
      const ztGanttLayout = this.ztGanttLayout;
      const timeline = this.element.querySelector("#zt-gantt-timeline-cell");
      const timelineData = this.element.querySelector(
        "#zt-gantt-timeline-data"
      );
      const headerHeight = this.calculateScaleHeight("scroll");
      const sidebar = this.element.querySelector("#zt-gantt-grid-left-data");
      const rightSideBar = this.element.querySelector(
        "#zt-gantt-grid-right-data"
      );

      const isVerScrollExist = this.element.querySelectorAll(
        ".zt-gantt-ver-scroll-cell"
      );
      const isHorScrollExist = this.element.querySelectorAll(
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
        ztGanttLayout.append(verticalScrollContainer);
      }

      // Create horizontal custom scroll
      const horScrollContainer = createCustomScrollContainer(
        "zt-gantt-hor-scroll-cell"
      );
      const horScroll = createCustomScroll("zt-gantt-hor-scroll");
      const horScrollContent = document.createElement("div");
      horScrollContent.style.width =
        timeline.scrollWidth +
        (ztGanttLayout.offsetWidth - timeline.offsetWidth) +
        "px";
      horScroll.append(horScrollContent);
      horScrollContainer.append(horScroll);

      // if scrolls exist then remove them then create
      removeExistingScrollElements(isHorScrollExist);

      if (
        timeline.scrollWidth +
          (ztGanttLayout.offsetWidth - timeline.offsetWidth) >
        ztGanttLayout.offsetWidth
      ) {
        ztGanttLayout.append(horScrollContainer);
      }

      verticalScroll.scrollTop = verScrollPos || timeline.scrollTop;
      horScroll.scrollLeft = horScrollPos || timeline.scrollLeft;

      let that = this;
      timeline.removeEventListener("scroll", handleCalendarScroll);
      timeline.addEventListener("scroll", handleCalendarScroll);

      function handleCalendarScroll(e) {
        sidebar.scrollTop = timeline.scrollTop;
        horScroll.scrollLeft = timeline.scrollLeft;
        verticalScroll.scrollTop = timeline.scrollTop;
        if (rightSideBar) {
          rightSideBar.scrollTop = timeline.scrollTop;
        }

        that.dispatchEvent("onScroll", { event: e });
      }

      sidebar.removeEventListener("scroll", handleSidebarScroll);
      sidebar.addEventListener("scroll", handleSidebarScroll);

      function handleSidebarScroll() {
        timeline.scrollTop = sidebar.scrollTop;
        verticalScroll.scrollTop = sidebar.scrollTop;
        if (rightSideBar) {
          rightSideBar.scrollTop = sidebar.scrollTop;
        }
      }

      // for horizontal custom scroller
      horScroll.removeEventListener("scroll", handleHorScroll);
      horScroll.addEventListener("scroll", handleHorScroll);
      function handleHorScroll() {
        timeline.scrollLeft = horScroll.scrollLeft;
      }

      // for rightSideBar custom scroll
      if (rightSideBar) {
        rightSideBar.removeEventListener("scroll", handleRightSidebarScroll);
        rightSideBar.addEventListener("scroll", handleRightSidebarScroll);
        function handleRightSidebarScroll() {
          timeline.scrollTop = rightSideBar.scrollTop;
          verticalScroll.scrollTop = rightSideBar.scrollTop;
          sidebar.scrollTop = rightSideBar.scrollTop;
        }
      }

      // for vertical custom scroller
      verticalScroll.addEventListener("scroll", function () {
        timeline.scrollTop = verticalScroll.scrollTop;
        sidebar.scrollTop = verticalScroll.scrollTop;
        if (rightSideBar) {
          rightSideBar.scrollTop = verticalScroll.scrollTop;
        }
      });

      const timelineResizer = this.element.querySelector(
        "#zt-gantt-timeline-resizer-wrap"
      );
      if (timelineResizer) {
        timelineResizer.style.left =
          timeline.offsetLeft + timeline.offsetWidth + "px";
      }

      function createCustomScrollContainer(id) {
        const container = document.createElement("div");
        container.id = id;
        container.classList.add(id);
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

      if (
        this.options.mouseScroll &&
        (this.options.ctrlKeyRequiredForMouseScroll ||
          !this.options.selectAreaOnDrag)
      ) {
        this.addMouseScroll(verticalScroll, horScroll);
      }
    }

    resizeTimeline(resizer, resizerLine, options) {
      let timeLineResizing = false,
        that = this,
        startX,
        resizerLeft,
        size,
        leftResizer;

      resizer.removeEventListener("mousedown", handleMouseDown);
      resizer.addEventListener("mousedown", handleMouseDown);

      function handleMouseDown(event) {
        startX = event.x;
        leftResizer = that.element.querySelector(
          "#zt-gantt-left-layout-resizer-wrap"
        );
        resizerLeft = resizer.offsetLeft;
        resizerLine.classList.add("resizing");

        // mouse move event
        document.addEventListener("mousemove", resize, false);
        // mouseup event
        document.addEventListener("mouseup", handleMouseUp, false);
      }

      function handleMouseUp(e) {
        document.removeEventListener("mousemove", resize, false);
        document.removeEventListener("mouseup", handleMouseUp, false);
        if (timeLineResizing) {
          let rightSideBar = that.element.querySelector(
            "#zt-gantt-grid-right-data"
          );

          let widthSize = rightSideBar.offsetWidth + (startX - e.x);

          widthSize =
            leftResizer.offsetLeft + 80 >= size
              ? widthSize - (leftResizer.offsetLeft + 80 - size)
              : widthSize;

          const totalMinWidth = options.columns.reduce(
            (totalWidth, col) => totalWidth + (col.min_width || 80),
            0
          );

          widthSize = widthSize < totalMinWidth ? totalMinWidth : widthSize;

          rightSideBar.style.width = widthSize + "px";
          rightSideBar.style.minWidth = widthSize + "px";

          let resizerLeft = 0,
            headerCell = document.getElementsByClassName("right-head-cell");

          for (let j = 0; j < headerCell.length; j++) {
            let columns = that.element.querySelectorAll(
              `[data-column-index="r-${j}"]`
            );

            // let incrasedWidth = widthSize / options.columns.length;
            let resizerWrap = document.getElementById(
              `zt-gantt-col-resizer-wrap-r-${j}`
            );

            let colWidth =
              headerCell[j].offsetWidth +
              (startX - e.x) / options.columns.length;

            colWidth =
              colWidth < (options.columns[j]?.min_width || 80)
                ? options.columns[j]?.min_width || 80
                : colWidth;

            // set the sidebar columns width
            for (let col of columns) {
              col.style.width = colWidth + "px";
            }

            that.options.rightGrid[j].width = colWidth;

            // set the sidebar columns resizer left
            resizerLeft += headerCell[j].offsetWidth;
            if (resizerWrap) {
              resizerWrap.style.left = resizerLeft + "px";
            }
          }

          that.options.rightGridWidth = rightSideBar.offsetWidth;

          if (
            that.calculateTimeLineWidth("updated") ===
            that.calculateTimeLineWidth("current")
          ) {
            that.createScrollbar();
          } else {
            // rerender the calendar and scale
            that.updateBody();
          }
        }
        resizerLine.classList.remove("resizing");
        timeLineResizing = false;
      }

      // resize the sidebar
      function resize(e) {
        timeLineResizing = true;
        size = resizerLeft + (e.x - startX);
        resizer.style.left = `${size}px`;
      }
    }

    /**
     * Retrieves a task from the data based on its ID.
     * @param {number | string} id - The ID of the task to retrieve.
     * @param {Array} data (optional)- The data array to search for the task (defaults to options.data).
     * @returns {Object|null} - The task object if found, otherwise null.
     */
    getTask(id, data = this.options.data) {
      for (let item of data) {
        if (item.id == id) {
          return item;
        }

        if (Array.isArray(item?.children)) {
          const found = this.getTask(id, item.children);
          if (found) {
            return found;
          }
        }
      }
      return null;
    }

    /**
     * Filter tasks based on user-defined conditions.
     * @param {Function} condition - The condition function used to filter tasks.
     * @param {boolean} isFilter - Indicates whether to apply the filter or reset.
     * @param {boolean} findRecursive - Indicates whether to find recursive parent-child tasks.
     */
    filterTask(condition, isFilter, findRecursive = false) {
      let parents = new Set();
      const that = this;

      const debouncedFilterTask = this.debounce(
        "filterTaskTimer",
        () => {
          if (!this.#searchedData) {
            this.oldOpenedTasks = [...this.options.openedTasks];
          }

          this.selectedRow = undefined;
          const allData = this.options.data; // Avoid unnecessary cloning

          if (!isFilter) {
            this.#searchedData = undefined;
            this.options.openedTasks = this.oldOpenedTasks;
            this.render();
            return;
          }

          this.#searchedData = findTask(allData, condition);

          this.render();
        },
        300
      );

      debouncedFilterTask();

      function findTask(data, condition) {
        let result = new Set();
        data.forEach((item) => {
          if (condition(item)) {
            result.add(item.id);
            if (that.options.splitTask || findRecursive) {
              findParents(item, result);
            }
          }
          if (Array.isArray(item.children)) {
            const filteredChildrenIds = findTask(item.children, condition);
            filteredChildrenIds.forEach((id) => result.add(id));
          }
        });

        return Array.from(result);
      }

      function findParents(item, result) {
        while (item.parent && item.parent != 0 && !parents.has(item.parent)) {
          parents.add(item.parent);
          result.add(item.parent);
          let parentItem = that.getTask(item.parent);
          if (parentItem) {
            item = parentItem;
          } else {
            break;
          }
        }
      }
    }

    /**
     * Method to add marker to the gantt.
     * @param {Object} marker - marker object.
     */
    addMarker(marker) {
      this.options.customMarker.push(marker);
    }

    // add custom marker to gantt
    addMarkerToGantt(data) {
      const markerStartDate = new Date(data.start_date);
      const isWeekend = this.options.weekends.includes(
        this.#dateFormat.day_short[markerStartDate.getDay()]
      );
      const isFullWeek = this.options.fullWeek;

      if (!isFullWeek && isWeekend) return;

      const markerArea = this.markerArea;

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

      const startDate = new Date(this.options.startDate);
      let daysDiff = this.getDates(startDate, markerStartDate);

      daysDiff = daysDiff.length - 1 || 0;

      let colWidth = this.calculateGridWidth(data.start_date, "day");

      flag.style.left = colWidth * daysDiff + colWidth / 2 + "px";

      markerArea.append(flag);
    }

    /**
     * Attaches an event listener to the element and handles the event callback.
     *
     * @param {string} name - The name of the event to listen for.
     * @param {Function} callback - The callback function to execute when the event is triggered.
     */
    attachEvent(name, callback) {
      const eventNamesToCheck = [
        "onBeforeTaskDrag",
        "onBeforeTaskDrop",
        "onBeforeProgressDrag",
        "onBeforeLinkAdd",
        "onBeforeTaskDblClick",
      ];

      this.element.addEventListener(name, handleEvent);

      let that = this;

      function handleEvent(e) {
        if (eventNamesToCheck.includes(name)) {
          that.#eventValue = callback(e.detail);
          that.#eventValue = that.#eventValue !== false;
        } else {
          callback(e.detail);
        }
      }
    }

    /**
     * Dispatches a custom event with the provided event name and detail.
     *
     * @param {string} eventName - The name of the custom event to dispatch.
     * @param {any} detail - Additional data to include with the event.
     */
    dispatchEvent(eventName, detail) {
      const event = new CustomEvent(eventName, { detail });
      this.element.dispatchEvent(event);
    }

    // get the position of a cell
    posFromDate(date) {
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

      cellBefore = isCellGreater
        ? cellBefore.length - 1
        : -(cellBefore.length - 1);

      // return the left of the cell of given date
      return Math.floor(cellBefore * this.calculateGridWidth(date) + pixels);
    }

    /**
     * Method to set the gantt to process data again.
     */
    clearAll() {
      this.#arrangeData = true;
      this.options.openedTasks.length = 0;
    }

    /**
     * Method to iterate of all the tasks.
     * @param {Function} callBack - A callback function.
     */
    eachTask(callBack) {
      // Recursive function to iterate over nested data
      const iterateOverData = (array) => {
        array.forEach((task, index) => {
          callBack(task, array, index);
          if (Array.isArray(task.children)) {
            iterateOverData(task.children);
          }
        });
      };

      // Start iteration from the root of the data
      iterateOverData(this.options.data);
    }

    /**
     * Updates the duration of each task in the data
     */
    updateTaskDuration() {
      this.eachTask((task) => {
        const { start_date, end_date } = this.getLargeAndSmallDate(task);
        task.duration = this.getDates(start_date, end_date, false)?.length || 0;
      });
    }

    // open a specific task tree
    openTask(id) {
      if (!id || this.isTaskOpened(id)) {
        return;
      }

      const sidebar = this.element.querySelector("#zt-gantt-left-grid");
      const taskRow = sidebar.querySelector(`[zt-gantt-task-id="${id}"]`);
      const children = this.element.querySelectorAll(`.zt-gantt-child-${id}`);
      const toggleTreeIcon = taskRow.querySelector(".zt-gantt-tree-icon");

      let task = this.getTask(id);
      if (task.parent !== 0) {
        this.openTask(task.parent);
      }

      if (!this.isTaskOpened(id)) {
        this.addTaskToOpenedList(id);
      }
      this.createTaskBars();

      children.forEach((child) => {
        child.classList.remove("zt-gantt-d-none");
        child.classList.add("zt-gantt-d-flex");
      });

      if (toggleTreeIcon) {
        toggleTreeIcon.classList.remove("zt-gantt-tree-close");
        toggleTreeIcon.classList.add("zt-gantt-tree-open");
      }
      let verScroll =
        this.element.querySelector(".zt-gantt-ver-scroll")?.scrollTop || 0;
      let horScroll =
        this.element.querySelector(".zt-gantt-hor-scroll")?.scrollLeft || 0;
      this.createScrollbar(verScroll, horScroll);
    }

    /**
     * Method to set the new data to the existing data
     * @param { Array } data - data to add in the existin gantt data.
     */
    parse(data) {
      const uniqueData = data.filter((obj) => !this.getTask(obj.id));

      this.options.data = [...this.#originalData, ...uniqueData];
      this.#arrangeData = true;

      if (this.options.collapse === false) {
        // Set opened tasks
        const uniqueIds = uniqueData.map((task) => task.id);
        this.addTaskToOpenedList(...uniqueIds);
      }
    }

    // split hour and minutes from decimal
    convertDecimalToTime(decimalTime) {
      const hours = Math.floor(decimalTime);
      const minutes = Math.round((decimalTime - hours) * 60);
      return { hours, minutes };
    }

    // get time from pixels
    getTimeByPx(pixels, date) {
      let pxPerMin = this.calculateGridWidth(date, "day") / (24 * 60);
      let dateTime = pixels / pxPerMin / 60;
      let { hours, minutes } = this.convertDecimalToTime(dateTime);
      return { hours, minutes };
    }

    // get pixels from time
    getPxByTime(date, type) {
      let hours = new Date(date).getHours();
      if (type === "width") {
        hours = hours === 0 ? 0 : 23 - hours;
      }
      let pxPerHour = this.calculateGridWidth(date, "day") / 24;
      let pixels = hours * pxPerHour;
      return pixels;
    }

    /**
     * Creates links between tasks.
     *
     * Type of links -
     *
     * 0 is  finish_to_start
     * 1 is  start_to_start
     * 2 is  finish_to_finish
     * 3 is  start_to_finish
     * @param {string | number} sourceId - The id of the source task.
     * @param {string | number} targetId - The id of the target task.
     * @param {object} link - The link object containing link type information.
     */
    createLinks(sourceId, targetId, link) {
      const linksArea = this.element.querySelector("#zt-gantt-links-area");

      const source = this.element.querySelector(
        `[zt-gantt-taskbar-id="${sourceId}"]`
      );
      const target = this.element.querySelector(
        `[zt-gantt-taskbar-id="${targetId}"]`
      );

      const linkType = link.type || 0;

      const createLink = this.isTaskExistOrHidden(source, target);

      if (!createLink) {
        return;
      }

      let rowHeight =
          this.element.querySelector(".zt-gantt-bar-task").offsetHeight,
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

      const taskLink = document.createElement("div");
      taskLink.classList.add("zt-gantt-task-link");
      taskLink.setAttribute("link-id", link.id);
      taskLink.setAttribute("link-type", linkType);
      linksArea.append(taskLink);

      const that = this;
      // handle double click event
      taskLink.addEventListener("dblclick", function () {
        that.dispatchEvent("onLinkDblClick", { link });
      });

      const startLine = document.createElement("div");
      startLine.classList.add("zt-gantt-hor-link-line", "zt-gantt-link-line");

      const middleLine = document.createElement("div");
      middleLine.classList.add("zt-gantt-ver-link-line", "zt-gantt-link-line");

      const endLine = document.createElement("div");
      endLine.classList.add("zt-gantt-hor-link-line", "zt-gantt-link-line");

      const linkVerInnerLine = document.createElement("div");
      linkVerInnerLine.classList.add("ver-inner-line");

      const linkHorInnerLine = document.createElement("div");
      linkHorInnerLine.classList.add("hor-inner-line");

      if (linkType == 0) {
        // 0 is  finish_to_start
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
        // 1 is  start_to_start
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
        // 2 is  finish_to_finish
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
        // 3 is  start_to_finish
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

      if (this.options.updateLinkOnDrag) {
        // call updateLinkPosition function onTaskDrag
        this.attachEvent("onTaskDrag", () => {
          this.updateLinkPosition(source, target, taskLink, rowHeight, link);
        });
      }

      // call updateLinkPosition function onAfterTaskDrag
      this.attachEvent("onAfterTaskDrag", () => {
        this.updateLinkPosition(source, target, taskLink, rowHeight, link);
      });

      // call updateLinkPosition function onAutoScheduling
      this.attachEvent("onAutoScheduling", () => {
        this.updateLinkPosition(source, target, taskLink, rowHeight, link);
      });
    }

    /**
     * Method to update the position of a link between two tasks.
     * @param {HTMLElement} source - The source task element.
     * @param {HTMLElement} target - The target task element.
     * @param {HTMLElement} link - The link element.
     * @param {number} rowHeight - The height of a row.
     * @param {object} linkObj - The link object containing information about the link.
     */
    updateLinkPosition(source, target, link, rowHeight, linkObj) {
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

      const taskLink = document.createElement("div");
      taskLink.setAttribute("link-id", linkObj.id);
      taskLink.classList.add("zt-gantt-task-link");

      const startLine = document.createElement("div");
      startLine.classList.add("zt-gantt-hor-link-line", "zt-gantt-link-line");

      const middleLine = document.createElement("div");
      middleLine.classList.add("zt-gantt-ver-link-line", "zt-gantt-link-line");

      const endLine = document.createElement("div");
      endLine.classList.add("zt-gantt-hor-link-line", "zt-gantt-link-line");

      const linkVerInnerLine = document.createElement("div");
      linkVerInnerLine.classList.add("ver-inner-line");

      const linkHorInnerLine = document.createElement("div");
      linkHorInnerLine.classList.add("hor-inner-line");

      let linkType = linkObj.type || 0;

      if (linkType === 0) {
        // 0 is  finish_to_start
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
                Math.abs(sourceTop - targetTop) - rowHeight / 2 + "px";
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
        // 1 is  start_to_start
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
        // 2 is  finish_to_finish
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
        // 3 is  start_to_finish
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
    }

    /**
     * Method to delete a link by its ID.
     * @param {string | number} id - The ID of the link to be deleted.
     */
    deleteLink(id) {
      let link = this.element.querySelector(`[link-id="${id}"]`);
      if (link !== undefined && link !== null) {
        link.remove();
        const linkIndex = this.options.links.findIndex((obj) => obj.id == id);
        const linkobj = this.options.links.find((obj) => obj.id === id) || null;
        if (linkIndex !== -1) {
          this.options.links.splice(linkIndex, 1);
        }

        this.dispatchEvent("onDeleteLink", { link: linkobj });
      }
    }

    /**
     * Method to create a new link between two tasks.
     * @param {HTMLElement} linkPoint - The link point element.
     * @param {HTMLElement} source - The source task element.
     * @param {string | number} sourceId - The ID of the source task.
     * @param {string} type - The type of link point ('left' or 'right').
     */
    createNewLink(linkPoint, source, sourceId, type) {
      let strech = false,
        startX,
        startY,
        targetId,
        targetType,
        that = this,
        autoScroll = false,
        rightPanelScroll,
        barsArea,
        linkDirection,
        scrollSpeed = 5, // Adjust the scroll speed by changing the value here
        autoScrollDelay = 5, // Adjust the scroll delay by changing the value here
        autoScrollTimer;

      linkPoint.removeEventListener("mousedown", handleMouseDown);
      linkPoint.addEventListener("mousedown", handleMouseDown);

      function handleMouseDown(e) {
        rightPanelScroll = document.getElementById("zt-gantt-timeline-cell");
        barsArea = document.getElementById("zt-gantt-bars-area");
        startX = e.clientX + rightPanelScroll.scrollLeft;
        startY = e.clientY + rightPanelScroll.scrollTop;

        let linksArea = that.element.querySelector("#zt-gantt-links-area");

        if (!linkDirection) {
          linkDirection = document.createElement("div");
          linkDirection.classList.add("zt-gantt-link-direction");
          linksArea.append(linkDirection);
        } else {
          linkDirection.style.width = `0px`;
          linksArea.append(linkDirection);
        }

        barsArea.classList.add("zt-gantt-link-streching");
        source.classList.add("source");

        document.addEventListener("mousemove", strechLink, false);
        document.addEventListener("mouseup", handleMouseUp, false);
      }

      function handleMouseUp() {
        autoScroll = false;
        document.removeEventListener("mousemove", strechLink, false);
        document.removeEventListener("mouseup", handleMouseUp, false);

        let selectedTarget = that.element.querySelector(".selected-target");
        if (selectedTarget) {
          selectedTarget.classList.remove("selected-target");
        }

        barsArea.classList.remove("zt-gantt-link-streching");
        source.classList.remove("source");

        if (strech) {
          linkDirection.remove();
          let linkType =
            type === "left" && targetType === "left"
              ? 1
              : type === "right" && targetType === "right"
              ? 2
              : type === "left" && targetType === "right"
              ? 3
              : 0;
          let isLinkExist = that.options.links.some(
            (obj) =>
              obj.source == sourceId &&
              obj.target == targetId &&
              obj.type == linkType
          );

          targetId =
            isNaN(targetId) || targetId === null ? targetId : +targetId;

          let hasCycle = that.hasCycle(sourceId, targetId);

          // handle custom event
          that.dispatchEvent("onBeforeLinkAdd", {
            sourceId,
            targetId,
            type: linkType,
          });

          if (that.#eventValue === false) {
            that.#eventValue = true;
            return;
          }

          if (
            targetId !== undefined &&
            targetId !== null &&
            targetId != sourceId &&
            !isLinkExist &&
            !hasCycle
          ) {
            const link = {
              id: `${linkType}-${sourceId}-${targetId}`,
              source: sourceId,
              target: targetId,
              type: linkType,
            };

            that.createLinks(sourceId, targetId, link);
            that.options.links.push(link);

            // handle custom event
            that.dispatchEvent("onLinkAdd", { link });
          }
        }
        strech = false;
      }

      function strechLink(e) {
        strech = true;

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
            if (autoScrollTimer) {
              clearInterval(autoScrollTimer);
            }
            autoScrollTimer = setTimeout(() => {
              startAutoScroll(type);
            }, autoScrollDelay); // Adjust the scroll delay by changing the value here
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
          that.element.offsetTop + that.calculateScaleHeight("scroll") + 30;

        // auto scroll the div top and bottom
        if (e.clientY > scrollThresholdTop - window.scrollY) {
          autoScroll = true;
          startAutoScroll("top");
        } else if (e.clientY < scrollThresholdBottom - window.scrollY) {
          autoScroll = true;
          startAutoScroll("bottom");
        }

        // Retrieve the mouse coordinates from the event
        let mouseX = e.pageX;
        let mouseY = e.pageY;

        // Calculate the differences between the mouse coordinates and the point coordinates
        let deltaX =
          mouseX -
          (startX -
            (type === "left" ? -20 : 20) -
            rightPanelScroll.scrollLeft +
            window.scrollX);
        let deltaY =
          mouseY - (startY - rightPanelScroll.scrollTop + window.scrollY);

        // Calculate the angle in radians
        let radians = Math.atan2(deltaY, deltaX);
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
          let selectedTarget = that.element.querySelector(".selected-target");
          if (selectedTarget !== undefined && selectedTarget !== null) {
            selectedTarget.classList.remove("selected-target");
          }
        }
      }
    }

    // Method to show loader
    showLoader() {
      const ztLoader = document.createElement("span");
      const ztLoaderDrop = document.createElement("div");

      ztLoader.id = "zt-gantt-loader";
      ztLoader.classList.add("zt-gantt-loader");
      ztLoaderDrop.classList.add("zt-gantt-loader-drop");

      document.body.append(ztLoaderDrop, ztLoader);
    }

    // method to hide loader
    hideLoader() {
      const ztLoader = document.querySelector("#zt-gantt-loader");
      const ztLoaderDrop = document.querySelector(".zt-gantt-loader-drop");

      if (ztLoader) {
        ztLoader.remove();
      }

      if (ztLoaderDrop) {
        ztLoaderDrop.remove();
      }
    }

    // method to initialize zoom options
    zoomInit(type = "after") {
      let zoomLevels = this.options.zoomConfig;
      for (const levels of zoomLevels.levels) {
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
        this.render();
      }
    }

    // method to get the number of days in  a month of a date
    getDaysInMonth(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth();

      const daysInMonth = new Date(year, month + 1, 0).getDate();

      return daysInMonth;
    }

    // method to get the days in quarter of a date
    getDaysInQuarter(dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = date.getMonth();

      const quarterStartMonth = Math.floor(month / 3) * 3;
      const quarterStartDate = new Date(year, quarterStartMonth, 1);
      const quarterEndDate = new Date(year, quarterStartMonth + 3, 0);

      const daysInQuarter =
        (quarterEndDate - quarterStartDate) / (1000 * 60 * 60 * 24) + 1;

      return daysInQuarter;
    }

    // method to get the quarter of a date
    getQuarterOfDate(date) {
      date = new Date(date);
      // Get the month from the date (0-11)
      const month = date.getMonth();
      // Calculate the quarter
      const quarter = Math.floor(month / 3) + 1;
      return quarter;
    }

    // method to get the current zoom level scale
    getScale() {
      return {
        unit: this.options.zoomLevel,
        step: 1,
        startDate: this.options.startDate,
        endDate: this.options.endDate,
      };
    }

    /**
     * Method to select an area on the Gantt chart by dragging the mouse.
     * @param {HTMLElement} timeLine - The timeline element.
     */
    selectAreaOnDrag(timeLine) {
      let startX,
        taskBarArea,
        hasMoved = false,
        taskArea,
        taskStartDate,
        taskEndDate,
        that = this,
        taskParent,
        end_date,
        timelineContainer,
        autoScroll = false,
        scrollSpeed = 5, // Adjust the scroll speed by changing the value here
        autoScrollDelay = 5, // Adjust the scroll delay by changing the value here
        autoScrollTimer;

      timeLine.removeEventListener("mousedown", handleMouseDown);
      timeLine.addEventListener("mousedown", handleMouseDown);

      function handleMouseDown(e) {
        if (
          that.options.mouseScroll &&
          that.options.ctrlKeyRequiredForMouseScroll &&
          e.ctrlKey
        )
          return;
        taskBarArea = that.element.querySelector("#zt-gantt-bars-area");
        timelineContainer = that.element.querySelector(
          "#zt-gantt-timeline-cell"
        );
        startX =
          e.clientX + timelineContainer.scrollLeft - that.element.offsetLeft;
        let classesToCheck = ["zt-gantt-task-row", "zt-gantt-task-cell"];

        let isClassPresent = false;
        for (let i = 0; i < classesToCheck.length; i++) {
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
          e.clientX - timeLine.offsetLeft + timelineContainer.scrollLeft
        }px`;
        taskArea.style.height = `${taskAreaRow.offsetHeight}px`;

        let allTaskBars = taskBarArea.querySelectorAll(".zt-gantt-bar-task");
        taskParent = allTaskBars[
          Math.floor(taskAreaRow.offsetTop / taskAreaRow.offsetHeight)
        ].getAttribute("zt-gantt-taskbar-id");
        let parentTask = that.getTask(taskParent);
        if (that.hasProperty(parentTask, "end_date")) {
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
          that.dispatchEvent("selectAreaOnDrag", { task });
        }
        hasMoved = false;
      }
      function createTaskArea(e) {
        hasMoved = true;

        if (
          e.clientX + timelineContainer.scrollLeft - that.element.offsetLeft <
          startX
        ) {
          taskArea.style.left = `${
            e.clientX -
            timeLine.offsetLeft +
            timelineContainer.scrollLeft -
            that.element.offsetLeft
          }px`;
          taskArea.style.width = `${
            startX -
            (e.clientX - that.element.offsetLeft) -
            timelineContainer.scrollLeft
          }px`;
        } else {
          taskArea.style.left = `${startX - timeLine.offsetLeft}px`;
          taskArea.style.width = `${
            e.clientX -
            startX +
            timelineContainer.scrollLeft -
            that.element.offsetLeft
          }px`;
        }
        let isTaskAreaExist = that.element.querySelector("#task-area");
        if (!isTaskAreaExist) {
          if (startX !== e.clientX) {
            taskBarArea.append(taskArea);
          }
        }

        function startAutoScroll(type) {
          if (type === "right") {
            timelineContainer.scrollLeft += scrollSpeed;
            if (
              timelineContainer.scrollLeft >=
              timelineContainer.scrollWidth - timelineContainer.clientWidth
            ) {
              autoScroll = false;
              return;
            }
          } else if (type === "left") {
            timelineContainer.scrollLeft -= scrollSpeed;
            if (timelineContainer.scrollLeft <= 0) {
              autoScroll = false;
              return;
            }
          }
          if (autoScroll) {
            if (autoScrollTimer) {
              clearInterval(autoScrollTimer);
            }
            autoScrollTimer = setTimeout(() => {
              startAutoScroll(type);
            }, autoScrollDelay); // Adjust the scroll delay by changing the value here
          }
        }

        const scrollContainer =
          that.element.offsetLeft + timelineContainer.offsetLeft;
        const scrollThresholdRight =
          scrollContainer + timelineContainer.offsetWidth - 30;
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
    }

    /**
     * Method to handle dragging of the task progress bar.
     * @param {HTMLElement} resizer - The resizer element used to drag the progress.
     * @param {HTMLElement} progress - The progress bar element.
     * @param {HTMLElement} taskBar - The task bar element.
     * @param {Object} task - The task data object.
     */
    dragTaskProgress(resizer, progress, taskBar, task) {
      let startX,
        dragging = false,
        that = this,
        autoScroll = false,
        timeLineContainer,
        scrollSpeed = 5, // Adjust the scroll speed by changing the value here
        autoScrollDelay = 5, // Adjust the scroll delay by changing the value here
        autoScrollTimer,
        startProgressWidth;

      resizer.removeEventListener("mousedown", handleMouseDown);
      resizer.addEventListener("mousedown", handleMouseDown);

      function handleMouseDown(e) {
        startProgressWidth = progress.offsetWidth;
        timeLineContainer = that.element.querySelector(
          "#zt-gantt-timeline-cell"
        );
        startX = e.clientX + timeLineContainer.scrollLeft;

        document.addEventListener("mousemove", resize, false);
        document.addEventListener("mouseup", handleMouseUp, false);
      }

      function handleMouseUp() {
        document.removeEventListener("mousemove", resize, false);
        document.removeEventListener("mouseup", handleMouseUp, false);
        if (dragging === true) {
          let progressPer = Math.round(
            (progress.offsetWidth / taskBar.offsetWidth) * 100
          );
          progress.style.width = `${progressPer}%`;
          resizer.style.left = `${progressPer}%`;

          task.progress = progressPer;
          that.#originalData.findIndex((item) => {
            if (item.id == task.id) {
              item.progress = progressPer;
            }
          });
          // handle custom event
          that.dispatchEvent("onAfterProgressDrag", { task });
        }
        dragging = false;
      }

      function resize(e) {
        that.dispatchEvent("onBeforeProgressDrag", { task });

        // if onBeforeProgressDrag return false then do not drag the Progress
        if (that.#eventValue === false) {
          return;
        }

        dragging = true;
        let progressWidth =
          startProgressWidth +
          (e.clientX - startX) +
          timeLineContainer.scrollLeft;

        progressWidth =
          progressWidth > taskBar.offsetWidth
            ? taskBar.offsetWidth
            : progressWidth < 0
            ? 0
            : progressWidth;

        progress.style.width = `${progressWidth}px`;
        resizer.style.left = `${progressWidth}px`;

        const progressPer = (progress.offsetWidth / taskBar.offsetWidth) * 100;

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
            if (autoScrollTimer) {
              clearInterval(autoScrollTimer);
            }

            autoScrollTimer = setTimeout(() => {
              startAutoScroll(type);
            }, autoScrollDelay);
          }
        }

        const scrollContainer =
          that.element.offsetLeft + timeLineContainer.offsetLeft;
        const scrollThresholdRight =
          scrollContainer + timeLineContainer.offsetWidth - 30;
        const scrollThresholdLeft = scrollContainer + 30;

        // auto scroll the div left and right
        if (
          e.clientX > scrollThresholdRight - window.scrollX &&
          progressPer < 100
        ) {
          autoScroll = true;
          startAutoScroll("right");
        } else if (
          e.clientX < scrollThresholdLeft - window.scrollX &&
          progressPer > 0
        ) {
          autoScroll = true;
          startAutoScroll("left");
        } else {
          autoScroll = false;
        }
      }
    }

    /**
     * Updates the body of the Gantt chart.
     */
    updateBody() {
      this.verScroll =
        this.element.querySelector(".zt-gantt-ver-scroll")?.scrollTop || 0;
      this.horScroll =
        this.element.querySelector(".zt-gantt-hor-scroll")?.scrollLeft || 0;

      const timeline = this.element.querySelector("#zt-gantt-timeline-cell");
      timeline.innerHTML = "";
      this.createTimelineScale(timeline);
      this.createTimelineBody(timeline);
    }

    /**
     * Automatically schedules tasks based on their dependencies.
     */
    autoScheduling() {
      const { links } = this.options;
      const linksLength = links?.length;
      for (let i = 0; i < linksLength; i++) {
        const link = this.options.links[i];

        if (!link) return;

        let source = this.element.querySelector(
          `[zt-gantt-taskbar-id="${link.source}"]`
        );

        let target = this.element.querySelector(
          `[zt-gantt-taskbar-id="${link.target}"]`
        );

        if (!source || !target) continue;

        let sourceLeft = source.offsetLeft,
          sourceWidth = source.offsetWidth,
          targetLeft = target.offsetLeft,
          targetWidth = target.offsetWidth;

        switch (link.type) {
          case 1:
            if (targetLeft < sourceLeft) {
              target.style.left = `${sourceLeft}px`;
            }
            break;
          case 2:
            if (targetLeft + targetWidth < sourceLeft + sourceWidth) {
              target.style.left = `${
                targetLeft +
                (sourceLeft + sourceWidth - (targetLeft + targetWidth))
              }px`;
            }
            break;
          case 3:
            if (targetLeft + targetWidth < sourceLeft) {
              target.style.left = `${sourceLeft - targetWidth}px`;
            }
            break;
          case 0:
            if (targetLeft < sourceLeft + sourceWidth) {
              target.style.left = `${sourceLeft + sourceWidth}px`;
            }
            break;
        }

        let task = this.getTask(link.target);
        let taskStartDate = this.calculateTaskStartDate(target, task);
        let taskEndDate = this.calculateTaskEndDate(target, task);

        this.#updateTask(task, taskStartDate, taskEndDate, target);

        this.dispatchEvent("onAutoScheduling", { task });
      }
    }

    // calculateTaskStartDate by element
    calculateTaskStartDate(target, task) {
      const dateDiff = Math.round(
        target.offsetLeft / this.calculateGridWidth(task.start_date, "day")
      );

      let taskStartDate =
        this.dates[dateDiff - (task.type === "milestone" ? 1 : 0)];

      // if taskStartDate is less than the gantt range
      if (!taskStartDate) {
        taskStartDate = this.add(new Date(this.dates[0]), dateDiff, "day");
      }
      return taskStartDate;
    }

    // calculateTaskEndDate by element
    calculateTaskEndDate(target, task) {
      let taskEndDate =
        this.dates[
          Math.round(
            (target.offsetLeft + target.offsetWidth) /
              this.calculateGridWidth(task.start_date, "day")
          ) - 1
        ];

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
      return taskEndDate;
    }

    /**
     * Checks if there is a cycle in the task dependencies, starting from the given source and target tasks.
     * also checks for the parent child relation.
     *
     * @param {string | number} currentSource - The ID of the current source task.
     * @param {string | number} currentTarget - The ID of the current target task.
     * @param {string | number} [linkId=""] - The ID of the link being checked (optional).
     * @returns {boolean} - Returns true if a cycle is detected, false otherwise.
     */
    hasCycle(currentSource, currentTarget, linkId = "") {
      if (!currentTarget) return false;

      if (currentSource == currentTarget) return true;

      let currentTargetTask = this.getTask(currentTarget);

      if (currentTargetTask?.parent == currentSource) return true;

      let currentSourceTask = this.getTask(currentSource);

      if (
        (currentSourceTask?.children?.length &&
          findTask(currentSourceTask, currentTarget)) ||
        (currentTargetTask?.children?.length &&
          findTask(currentTargetTask, currentSource))
      ) {
        return true;
      }

      // check is child or parent
      function findTask(parentTask, targetId) {
        if (!parentTask?.children?.length) return false;

        for (const task of parentTask.children) {
          if (task?.id == targetId) {
            return true;
          } else if (task?.children?.length) {
            return findTask(task, targetId);
          }
        }
        return false;
      }

      const filteredLinks = this.options.links.filter(
        (link) => link.target == currentSource && link.id != linkId
      );
      if (!filteredLinks?.length) return false;

      for (let link of filteredLinks) {
        if (
          link.source === currentTarget ||
          this.hasCycle(link?.source, currentTarget, link?.id)
        ) {
          return true;
        } else {
          return false;
        }
      }
      return false;
    }

    /**
     * Method to throw error.
     * @param {string} error - error message
     */
    throwError(error) {
      throw new Error(error);
    }

    /**
     * Displays a toast notification with a specified title, message, and type.
     * The toast can be dismissed by clicking on it or automatically after a delay.
     *
     * @param {string|null} title - The title of the toast notification (optional).
     * @param {string} message - The message of the toast notification.
     * @param {string} type - The type of the toast notification, used for styling.
     */
    toastr(title = null, message, type) {
      let toastrArea = document.querySelector(".zt-gantt-toastr-area");
      if (!toastrArea) {
        toastrArea = document.createElement("div");
        toastrArea.classList.add("zt-gantt-toastr-area");
        document.body.append(toastrArea);
      }

      const newToastr = document.createElement("div");
      newToastr.classList.add("zt-gantt-toastr", `zt-gantt-toastr-${type}`);
      const titleDiv = document.createElement("p");
      const messageDiv = document.createElement("p");
      messageDiv.innerHTML = message;
      if (title) {
        titleDiv.innerHTML = title;
        newToastr.append(titleDiv);
      }

      newToastr.append(messageDiv);
      newToastr.classList.add("zt-gantt-toastr-show");

      toastrArea.append(newToastr);

      const removeToastr = () => {
        newToastr.classList.remove("zt-gantt-toastr-show");
        newToastr.classList.add("zt-gantt-toastr-hide");
        setTimeout(() => {
          newToastr.remove();
        }, 500);
      };

      let removeTimer = setTimeout(removeToastr, 3000);

      newToastr.addEventListener("click", () => {
        clearTimeout(removeTimer);
        removeToastr();
      });

      newToastr.addEventListener("mouseenter", () => {
        clearTimeout(removeTimer); // Clear the timeout when mouse enters
      });

      newToastr.addEventListener("mouseleave", () => {
        removeTimer = setTimeout(removeToastr, 3000); // Start the timeout again when mouse leaves
      });
    }

    /**
     * method to convert dateString to date object on based on date_format
     * @param {string} dateString - Date string
     * @returns returns the date object converted from datestring based on date_format
     */
    getDateTimeComponents(dateString) {
      if (!dateString) {
        return;
      }
      const formatString = this.options.date_format;
      const formatMap = {
        "%d": "day", // day with leading zero
        "%j": "day", // day without leading zero
        "%m": "month", // month with leading zero
        "%n": "month", // month without leading zero
        "%Y": "year", // four-digit year
        "%y": "year", // two-digit year
        "%H": "hour", // hour (24-hour clock) with leading zero
        "%G": "hour", // hour (24-hour clock) without leading zero
        "%h": "hour", // hour (12-hour clock) with leading zero
        "%g": "hour", // hour (12-hour clock) without leading zero
        "%i": "minute", // minutes with leading zero
        "%s": "second", // seconds with leading zero
        "%a": "amPm", // am/pm
        "%A": "amPm", // AM/PM
      };
      // M, F, W, l, D,

      const regexMap = {
        "%d": "(\\d{2})",
        "%j": "(\\d{1,2})",
        "%m": "(\\d{2})",
        "%n": "(\\d{1,2})",
        "%Y": "(\\d{4})",
        "%y": "(\\d{2})",
        "%H": "(\\d{2})",
        "%G": "(\\d{1,2})",
        "%h": "(\\d{2})",
        "%g": "(\\d{1,2})",
        "%i": "(\\d{2})",
        "%s": "(\\d{2})",
        "%a": "(am|pm)",
        "%A": "(AM|PM)",
      };

      // Build the regex pattern based on the format string
      let regexPattern = formatString;
      for (const [format, regex] of Object.entries(regexMap)) {
        regexPattern = regexPattern.replace(format, regex);
      }

      const regex = new RegExp(regexPattern);
      const matches = dateString.match(regex);

      if (!matches) {
        throw new Error(
          `The date string "${dateString}" does not match the format string "${formatString}".`
        );
      }

      const dateComponents = {
        day: "01",
        month: "01",
        year: "1970",
        hour: "00",
        minute: "00",
        second: "00",
        amPm: "AM",
      };

      // Extract components based on the input format
      let matchIndex = 1;
      for (const part of formatString.match(/%[a-zA-Z]/g)) {
        if (formatMap[part]) {
          dateComponents[formatMap[part]] = matches[matchIndex++];
        }
      }

      // Convert components to appropriate values
      const day = parseInt(dateComponents.day, 10);
      const month = parseInt(dateComponents.month, 10) - 1; // JavaScript months are 0-based
      const year =
        dateComponents.year.length === 2
          ? (parseInt(dateComponents.year, 10) < 50 ? "20" : "19") +
            dateComponents.year
          : parseInt(dateComponents.year, 10);
      const hour = parseInt(dateComponents.hour, 10);
      const minute = parseInt(dateComponents.minute, 10);
      const second = parseInt(dateComponents.second, 10);

      // Adjust for 12-hour clock if necessary
      let finalHour = hour;
      if (formatString.includes("%h") || formatString.includes("%g")) {
        if (dateComponents.amPm.toLowerCase() === "pm" && hour < 12) {
          finalHour += 12;
        }
        if (dateComponents.amPm.toLowerCase() === "am" && hour === 12) {
          finalHour = 0;
        }
      }

      // Create a Date object
      const dateObject = new Date(year, month, day, finalHour, minute, second);

      return dateObject;
    }

    /**
     * Adds event listeners to a color input to change the color of a taskbar,
     * task progress, and taskbar content. Dispatches a custom event when the color changes.
     *
     * @param {HTMLElement} taskbar - The taskbar element to change the color of.
     * @param {HTMLInputElement} colorInput - The color input element.
     * @param {HTMLElement} taskProgress - The task progress element to change the color of.
     * @param {HTMLElement} taskbarContent - The taskbar content element to change the color of.
     * @param {Object} task - The task object associated with the taskbar.
     */
    changeTaskbarColor(
      taskbar,
      colorInput,
      taskProgress,
      taskbarContent,
      task
    ) {
      const applyColors = (color) => {
        if (taskProgress) {
          taskProgress.style.setProperty(
            "background-color",
            color,
            "important"
          );
        }

        if (task.type === "milestone") {
          taskbarContent.style.setProperty(
            "background-color",
            color,
            "important"
          );
          taskbarContent.style.setProperty("border-color", color, "important");
        } else {
          const taskColor = taskProgress ? this.changeOpacity(color) : color;
          taskbar.style.setProperty("background-color", taskColor, "important");
          taskbar.style.setProperty("border-color", color, "important");
        }
      };

      const debouncedHandleColorChange = this.debounce(
        "changeColorTimer",
        (e) => {
          const color = e.target.value;
          applyColors(color);
          setColorToOriginalData(color);
          this.dispatchEvent("onColorChange", { taskColor: color, task });
        },
        20
      );

      colorInput.addEventListener("change", debouncedHandleColorChange);
      colorInput.addEventListener("input", debouncedHandleColorChange);

      const setColorToOriginalData = (color) => {
        task.taskColor = color;
        const taskIndex = this.#originalData.findIndex(
          (item) => item.id == task.id
        );
        if (taskIndex !== -1) {
          this.#originalData[taskIndex].taskColor = color;
        }
      };
    }

    /**
     * Method to change the opacity of a given color.
     * @param {string} color - The color to change the opacity of.
     * @returns {string} - The color with the specified opacity in rgba format.
     */
    changeOpacity(color) {
      const opacity = this.options.taskOpacity;

      const tempElement = document.createElement("div");
      tempElement.style.color = color;
      document.body.appendChild(tempElement);

      const computedColor = window.getComputedStyle(tempElement).color;

      document.body.removeChild(tempElement);
      // Extract the rgb values
      const rgbValues = computedColor.match(/\d+/g).map(Number);

      // Return the color in rgba format with the specified opacity
      return `rgba(${rgbValues[0]}, ${rgbValues[1]}, ${rgbValues[2]}, ${opacity})`;
    }

    // Function to convert RGBA to HEX
    rgbaToHex(rgbaColor) {
      if (rgbaColor) {
        const rgbaArray = rgbaColor.match(/\d+/g);
        const hexValue =
          "#" +
          ("0" + parseInt(rgbaArray[0], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgbaArray[1], 10).toString(16)).slice(-2) +
          ("0" + parseInt(rgbaArray[2], 10).toString(16)).slice(-2);
        return hexValue;
      }
      return false;
    }

    /**
     * Method to set the local language to the gantt.
     * @param { string } language - language code.
     */
    setLocalLang(language) {
      this.options.localLang = language;
      this.options.currentLanguage = this.options.i18n[language];
      this.updateBody();
    }

    /**
     * Destroys the Gantt chart by removing its layout, tooltip, and event listeners,
     * and resetting the main element.
     */
    destroy() {
      if (this.ztGanttLayout) {
        this.ztGanttLayout.remove();
        this.ztGanttLayout = null;
      }

      if (this.tooltip) this.tooltip.remove();

      if (this.lightbox) {
        this.lightbox.lightbox.remove();
        this.lightbox.lightboxBackdrop.remove();
        this.lightbox = null;
      }

      document.removeEventListener(
        "webkitfullscreenchange",
        this.handleFullScreenChangeSafari
      );
      document.removeEventListener(
        "fullscreenchange",
        this.handleFullScreenChange
      );
      window.removeEventListener("resize", this.handleResizeWindow);
      const newElement = this.element.cloneNode(true);
      this.element.replaceWith(newElement);
      this.element = newElement;
    }

    /**
     * Checks if the source and target elements exist and are not hidden.
     *
     * @param {HTMLElement | null} source - The source element to check.
     * @param {HTMLElement | null} target - The target element to check.
     * @returns {boolean} - Returns true if both elements exist and are not hidden, false otherwise.
     */
    isTaskExistOrHidden(source, target) {
      if (!source || !target || source === target) {
        return false; // Return false if either element is null, undefined, or the same element
      }

      let sourceStyle = source ? window.getComputedStyle(source) : null;
      let targetStyle = target ? window.getComputedStyle(target) : null;

      let isSourceHidden = sourceStyle ? sourceStyle.display === "none" : false;
      let isTargetHidden = targetStyle ? targetStyle.display === "none" : false;

      return !isSourceHidden && !isTargetHidden;
    }

    /**
     * Method to create split tasks.
     *
     * @param {*} barContainer  - taskbar container.
     * @param {*} isFromRender  - is calling from render or not.
     */
    createSplitTask(barContainer = null, isFromRender = false) {
      let rowCount = 0;

      let ztGanttBarsArea = document.createElement("div");
      ztGanttBarsArea.classList.add("zt-gantt-bars-area");
      ztGanttBarsArea.id = "zt-gantt-bars-area";

      let tasksData = [];

      function getUniqueObjects(data) {
        let tasksArray = [];
        for (let i = 0; i < data.length; i++) {
          const task = data[i];

          if (tasksArray.length == 0) {
            tasksArray.push(task);
          } else {
            let flag = false;
            for (let j = 0; j < tasksArray.length; j++) {
              if (
                new Date(tasksArray[j].start_date).getTime() ===
                  new Date(task.start_date).getTime() &&
                new Date(tasksArray[j].end_date).getTime() ===
                  new Date(task.end_date).getTime()
              ) {
                flag = true;
                tasksArray[j] = task;
                break;
              }
            }
            if (!flag) {
              tasksArray.push(task);
            }
          }
          if (data[i].children) {
            getUniqueObjects(data[i].children);
          }
        }
        return tasksArray;
      }

      for (let i = 0; i < this.options.data.length; i++) {
        if (this.options.data[i].children) {
          let tasks = getUniqueObjects(this.options.data[i].children);
          tasksData.push(tasks);
        }
      }

      for (let j = 0; j < tasksData.length; j++) {
        for (let k = 0; k < tasksData[j].length; k++) {
          const task = tasksData[j][k];

          if (this.isTaskNotInSearchedData(task.id)) continue;

          let start_date = task.start_date;
          let end_date = task.end_date || task.start_date;

          if (task.children && task.children.length > 0) {
            let data = [...task.children];
            let startAndEndDate = this.getStartAndEndDate(data);
            let start = startAndEndDate.startDate;
            let end = startAndEndDate.endDate;

            const setDate = (date) => {
              const d = new Date(date);
              d.setHours(0, 0, 0, 0);
              return d;
            };

            const dates = [
              setDate(start_date || start),
              setDate(start),
              setDate(end_date || end),
              setDate(end),
            ];

            start_date = new Date(Math.min(...dates));
            end_date = new Date(Math.max(...dates));
          }

          let cellStartDate = this.options.startDate;
          let isCellGreater = true;
          let cellBefore = this.getDates(cellStartDate, start_date);

          if (cellBefore.length === 0) {
            cellBefore = this.getDates(start_date, cellStartDate);
            isCellGreater = false;
          }

          if (isCellGreater) {
            cellBefore = cellBefore.length - 1;
          } else {
            cellBefore = -(cellBefore.length - 1);
          }
          let ztGanttBarTask = document.createElement("div");

          if (task.taskColor && task.type !== "milestone") {
            ztGanttBarTask.style.setProperty(
              "background-color",
              this.changeOpacity(task.taskColor),
              "important"
            );
            ztGanttBarTask.style.setProperty(
              "border-color",
              task.taskColor,
              "important"
            );
          }

          if (task.type === "milestone") {
            ztGanttBarTask.classList.add(
              "zt-gantt-bar-task",
              "zt-gantt-bar-milestone",
              this.options.selectedTask === `${task.id}`
                ? "zt-gantt-selected-task-bar"
                : "zt-gantt-bar-milestone"
            );
          } else {
            ztGanttBarTask.classList.add(
              "zt-gantt-bar-task",
              "zt-gantt-bar-parent-task",
              this.options.selectedTask === `${task.id}`
                ? "zt-gantt-selected-task-bar"
                : "zt-gantt-bar-task"
            );
          }

          //add custom class from user
          this.addClassesFromFunction(
            this.templates.task_class,
            ztGanttBarTask,
            task.start_date,
            task.end_date,
            task
          );

          ztGanttBarTask.setAttribute("task-parent", j);
          ztGanttBarTask.setAttribute("data-task-pos", 0);
          ztGanttBarTask.setAttribute("zt-gantt-taskbar-id", task.id);

          let taskLeft =
            cellBefore * this.calculateGridWidth(start_date, "day");

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
          if (task.type === "milestone") {
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

          if (task.type === "milestone" && task.taskColor) {
            ztGanttBarTaskContent.style.setProperty(
              "background-color",
              task.taskColor,
              "important"
            );

            ztGanttBarTaskContent.style.setProperty(
              "border-color",
              task.taskColor,
              "important"
            );
          }

          let that = this;

          // handle double click event
          ztGanttBarTask.addEventListener("dblclick", handleDblClick);

          function handleDblClick() {
            // custom event handler
            that.dispatchEvent("onBeforeTaskDblClick", { task });

            // if onBeforeTaskDblClick return false then do not drag the task
            if (that.#eventValue === false) {
              that.#eventValue = true;
              return;
            }

            that.dispatchEvent("onTaskDblClick", { task });

            that.showLightBox(task);
          }

          const userAgent = navigator.userAgent;

          // Handle mouseover event
          ztGanttBarTask.addEventListener("mouseover", handleMouseOver);
          function handleMouseOver() {
            if (/^((?!chrome|android).)*safari/i.test(userAgent)) {
              ztGanttBarTask.classList.add("hovered");
            }

            that.updateTooltipBody(task);
          }

          // Handle mouseleave event
          ztGanttBarTask.addEventListener("mouseleave", handleMouseLeave);

          function handleMouseLeave() {
            if (/^((?!chrome|android).)*safari/i.test(userAgent)) {
              ztGanttBarTask.classList.remove("hovered");
            }

            that.hideTooltip();
          }

          if (
            this.callTemplate("task_drag", "resize", task) &&
            task.type !== "milestone"
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
              task
            );
            this.resizeTaskBars(
              ztGanttTaskDragRight,
              ztGanttBarTask,
              "right",
              task
            );
          }

          let taskDates = this.getDates(start_date, end_date);

          let taskProgress;
          const isTaskProgress = this.isFunction(this.options.taskProgress)
            ? this.options.taskProgress(task)
            : this.options.taskProgress;
          if (isTaskProgress === true && task.type !== "milestone") {
            let progressPer = task.progress || 0;
            let taskProgressContainer = document.createElement("div");
            taskProgressContainer.classList.add(
              "zt-gantt-task-progress-wrapper"
            );
            taskProgress = document.createElement("div");
            taskProgress.classList.add("zt-gantt-task-progress");
            taskProgress.style.width = `${
              progressPer > 100 ? 100 : progressPer
            }%`;

            if (task.taskColor) {
              taskProgress.style.setProperty(
                "background-color",
                task.taskColor,
                "important"
              );
            }

            taskProgressContainer.append(taskProgress);

            let taskProgressDrag = document.createElement("div");
            taskProgressDrag.classList.add("zt-gantt-task-progress-drag");
            taskProgressDrag.style.left = `${
              progressPer > 100 ? 100 : progressPer
            }%`;

            // update the task progress onAfterTaskUpdate
            this.attachEvent("onAfterTaskUpdate", () => {
              let progress = progressPer > 100 ? 100 : task.progress || 0;
              taskProgress.style.width = `${progress}%`;

              taskProgressDrag.style.left = `${progress}%`;
            });

            ztGanttBarTask.append(taskProgressContainer, taskProgressDrag);
            this.dragTaskProgress(
              taskProgressDrag,
              taskProgress,
              ztGanttBarTask,
              task
            );
          }

          if (this.callTemplate("task_drag", "move", task)) {
            this.resizeTaskBars(
              ztGanttBarTaskContent,
              ztGanttBarTask,
              "move",
              task
            );
          }

          // link control pointers
          let isAddLinks = this.isFunction(this.options.addLinks)
            ? this.options.addLinks(task)
            : this.options.addLinks;

          if (isAddLinks === true) {
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

            this.createNewLink(rightPoint, ztGanttBarTask, task.id, "right");
            this.createNewLink(leftPoint, ztGanttBarTask, task.id, "left");
          }

          //add custom task color picker
          let isCustomColor = this.isFunction(this.options.taskColor)
            ? this.options.taskColor(task)
            : this.options.taskColor;

          if (isCustomColor) {
            let colorPicker = document.createElement("div");
            colorPicker.classList.add("zt-gantt-task-color-picker");
            let colorInput = document.createElement("input");
            colorInput.type = "color";

            setTimeout(() => {
              const backgroundElement =
                task.type === "milestone"
                  ? ztGanttBarTaskContent
                  : ztGanttBarTask;
                  
              // Get the computed style of the element
              const backgroundColor =
                task.taskColor ||
                this.rgbaToHex(
                  window
                    .getComputedStyle(backgroundElement)
                    .getPropertyValue("background-color")
                );

              colorInput.value = backgroundColor;
            }, 0);

            colorPicker.append(colorInput);
            ztGanttBarTask.append(colorPicker);
            this.changeTaskbarColor(
              ztGanttBarTask,
              colorInput,
              taskProgress,
              ztGanttBarTaskContent,
              task
            );
          }

          if (task.type !== "milestone") {
            let taskWidth =
              taskDates.length * this.calculateGridWidth(end_date, "day");

            if (taskWidth === 0 || !taskWidth) {
              ztGanttBarTask.classList.add("zt-gantt-d-none");
            }

            let hourWidth = this.getPxByTime(end_date, "width");
            let hourLeft = this.getPxByTime(start_date, "left");
            hourWidth += hourLeft;
            taskWidth -= hourWidth;

            ztGanttBarTask.style.width = taskWidth + "px";
          }

          let sideContent;
          if (task.type === "milestone") {
            sideContent = document.createElement("div");
            sideContent.classList.add("zt-gantt-side-content");
            sideContent.innerHTML = this.callTemplate(
              "taskbar_text",
              new Date(task.start_date),
              new Date(task.end_date),
              task
            );
            ztGanttBarTask.append(sideContent);
          } else {
            ztGanttBarTaskContent.innerHTML = this.callTemplate(
              "taskbar_text",
              new Date(task.start_date.setHours(0)),
              new Date(task.end_date.setHours(0)),
              task
            );
          }
          ztGanttBarTask.append(ztGanttBarTaskContent);

          this.attachEvent("onAfterTaskUpdate", () => {
            const innerHTML = this.callTemplate(
              "taskbar_text",
              task.start_date.setHours(0),
              task.end_date.setHours(0),
              task
            );
            if (task.type === "milestone") {
              sideContent.innerHTML = innerHTML;
            } else {
              ztGanttBarTaskContent.innerHTML = innerHTML;
            }
          });

          ztGanttBarsArea.append(ztGanttBarTask);
        }

        const barsArea = document.getElementById("zt-gantt-bars-area");

        if (barContainer === null) {
          barContainer = document.getElementById("zt-gantt-timeline-data");
        }
        // if barsArea exist then remove barsArea
        if (barsArea && !isFromRender) {
          barsArea.replaceWith(ztGanttBarsArea);
        } else {
          barContainer.append(ztGanttBarsArea);
        }
      }
    }

    /**
     * Method to calculate Gantt chart height.
     * @returns {number} - The total Gantt chart height.
     */
    get calculateGanttHeight() {
      let totalGanttHeight = this.calculateScaleHeight("scroll");

      // Helper function to calculate the height of visible tasks recursively
      const calculateVisibleTasksHeight = (task) => {
        let childHeight = 0;
        if (this.isTaskOpened(task.id)) {
          childHeight += task.children.length * this.options.row_height;
          task?.children?.forEach((child) => {
            childHeight += calculateVisibleTasksHeight(child);
          });
        }
        return childHeight;
      };

      // Iterate over each task to add its height to the total Gantt chart height
      this.options.data.forEach((task) => {
        totalGanttHeight += this.options.row_height;
        if (this.isTaskOpened(task.id)) {
          totalGanttHeight += calculateVisibleTasksHeight(task);
        }
      });

      return totalGanttHeight;
    }

    /**
     * Determines the earliest start date and the latest end date from task data or its children.
     *
     * @param {Object} taskData - The task object.
     * @returns {Object} {start_date, end_date} - An object containing the earliest start date and the latest end date.
     */
    getLargeAndSmallDate(taskData) {
      const { children = [], start_date = null, end_date = null } = taskData;

      let startDate, endDate;
      if (children?.length) {
        const startAndEndDate = this.getStartAndEndDate([...children]);
        ({ startDate, endDate } = startAndEndDate);
      } else {
        startDate = start_date;
        endDate = end_date;
      }

      const setDate = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
      };

      const dates = [startDate, endDate, start_date, end_date];
      const filteredDates = dates.filter((date) => date);
      const sanitizedDates = filteredDates.map(setDate);

      const minDate = new Date(Math.min(...sanitizedDates));
      const maxDate = new Date(Math.max(...sanitizedDates));

      return { start_date: minDate, end_date: maxDate };
    }

    /**
     * Adds mouse scroll functionality to the Gantt chart.
     * method to add mouse scroll in gantt with  ctrl+click or with click only,
     * based on this.options.mouseScroll or this.options.ctrlKeyRequiredForMouseScroll
     *
     * @param {HTMLElement} verticalScroll - The vertical scrollbar element.
     * @param {HTMLElement} horizontalScroll - The horizontal scrollbar element.
     */
    addMouseScroll(verticalScroll, horizontalScroll) {
      const timeLine = this.element.querySelector("#zt-gantt-timeline-cell");
      timeLine.addEventListener("mousedown", handleMouseDown);
      let startX,
        startY,
        isScrolling = false,
        that = this;

      function handleMouseDown(event) {
        if (
          (that.options.ctrlKeyRequiredForMouseScroll && !event.ctrlKey) ||
          event.target.closest(".zt-gantt-bar-task")
        )
          return;

        document.addEventListener("mouseup", handleMouseUp, false);
        document.addEventListener("mousemove", scrollTimeline, false);

        startX = event.clientX;
        startY = event.clientY;
        isScrolling = true;
      }

      function handleMouseUp() {
        isScrolling = false;
        document.removeEventListener("mousemove", scrollTimeline, false);
        document.removeEventListener("mouseup", handleMouseUp, false);
      }

      function scrollTimeline(event) {
        if (!isScrolling) return;

        const xScroll = startX - event.clientX;
        const yScroll = startY - event.clientY;

        verticalScroll.scrollTop += yScroll;
        horizontalScroll.scrollLeft += xScroll;

        startX = event.clientX;
        startY = event.clientY;
      }
    }

    /**
     * Sorts the Gantt chart data based on a specified field and sort order.
     *
     * @param {string} sortBy - The field by which the data should be sorted.
     * @param {boolean} isAsc - Indicates whether the sort order is ascending (true) or descending (false).
     */
    sort(sortBy, isAsc) {
      const sortOrderMultiplier = isAsc ? 1 : -1;

      this.#originalData.sort((a, b) => {
        let valueA = this.getFieldValue(a, sortBy);
        let valueB = this.getFieldValue(b, sortBy);

        // Handle null values
        if (valueA === null) {
          valueA = ""; // Treat null as an empty string
        }
        if (valueB === null) {
          valueB = ""; // Treat null as an empty string
        }
        valueA = typeof valueA === "string" ? valueA.toLowerCase() : valueA;
        valueB = typeof valueB === "string" ? valueB.toLowerCase() : valueB;
        return (
          (valueA < valueB ? -1 : valueA > valueB ? 1 : 0) * sortOrderMultiplier
        );
      });
      this.render();
    }

    /**
     * Function to safely get the field value from the object,
     * this is a support method for sort method
     */
    getFieldValue(object, fieldName) {
      return fieldName
        .split(".")
        .reduce(
          (o, key) => (o && o[key] !== undefined ? o[key] : null),
          object
        );
    }

    /**
     * Adds an inline editor to a cell for editing cell data.
     *
     * @param {Object} cellData - The data associated with the cell.
     * @param {Object} editorData - The configuration data for the editor.
     * @param {HTMLElement} cell - The cell element to which the editor is attached.
     * @param {HTMLElement} sidebarDataContainer - The container element for the editor.
     */
    addInlineEditor(cellData, editorData, cell, sidebarDataContainer) {
      const editorWraper = document.createElement("div");
      editorWraper.classList.add("zt-gantt-inline-editor-wraper");
      editorWraper.style.cssText = `
            top: ${cell.offsetTop}px;
            left: ${cell.offsetLeft}px;
            height: ${cell.offsetHeight}px;
            width: ${cell.offsetWidth}px;
        `;

      const editor = document.createElement(
        editorData.type === "select" ? "select" : "input"
      );
      editor.type =
        editorData.type === "select" ? editorData.value : editorData.type;
      editor.name = editorData.map_to;

      if (editorData.type === "select") {
        editor.value = cellData[editorData.map_to];
        editorData.options.forEach((option) => {
          const optionElem = document.createElement("option");
          optionElem.innerHTML = option;
          optionElem.value = option;
          editor.appendChild(optionElem);
        });
      } else if (editorData.type === "date") {
        editor.value = this.formatDateToString(
          "%Y-%m-%d",
          cellData[editorData.map_to]
        );
      } else {
        editor.value = cellData[editorData.map_to];
        editor.min = editorData.min;
        editor.max = editorData.max;
      }

      editorWraper.append(editor);

      sidebarDataContainer.append(editorWraper);

      editor.focus();

      editor.addEventListener("blur", () => {
        // handle custom event
        this.dispatchEvent("onBeforeSave", {
          task: cellData,
          columnName: editorData.map_to,
          oldValue: cellData[editorData.map_to],
          newValue: editor.value,
        });

        cellData[editorData.map_to] = editor.value;

        this.updateTaskData(cellData);

        this.removeInlineEditor(editorWraper);
        // handle custom event
        this.dispatchEvent("onSave", {
          task: cellData,
          columnName: editorData.map_to,
          oldValue: cellData[editorData.map_to],
          newValue: editor.value,
        });
      });
    }

    /**
     * Removes an inline editor element from the DOM.
     *
     * @param {HTMLElement} editor - The inline editor element to be removed.
     */
    removeInlineEditor(editor) {
      if (editor) {
        editor.remove();
      }
    }

    /**
     * Creates a debounced version of a function, which delays its execution until after
     * a certain wait time has elapsed without further calls.
     *
     * @param {string} key - The key to strore the debounce function timeout id to clear it.
     * @param {Function} func - The function to debounce.
     * @param {number} wait - The time in milliseconds to wait before executing the debounced function.
     * @returns {Function} - Returns the debounced function.
     */
    debounce(key, func, wait) {
      return (...args) => {
        const context = this;
        if (this.#debounceTimers.has(key)) {
          clearTimeout(this.#debounceTimers.get(key));
        }
        const timeoutId = setTimeout(() => func.apply(context, args), wait);
        this.#debounceTimers.set(key, timeoutId);
      };
    }

    /**
     * Checks if a given date is outside the range of the Gantt chart range.
     *
     * @param {Date} date - The date to check.
     * @returns {boolean} - Returns true if the date is outside the Gantt chart range, otherwise false.
     */
    outOfGanttRange(date) {
      const targetDate = this.stripTime(date).getTime();
      const startDate = this.stripTime(this.options.startDate).getTime();
      const endDate = this.stripTime(this.options.endDate).getTime();
      return targetDate < startDate && targetDate > endDate;
    }

    /**
     * Creates a tooltip element if it does not already exist.
     * Attaches necessary event listeners for tooltip positioning.
     */
    createTooltip() {
      // if tooltip exist then return
      if (this.tooltip) return;

      const tooltip = document.createElement("div");
      tooltip.classList.add("zt-gantt-tooltip");
      tooltip.id = "zt-gantt-tooltip";
      tooltip.style.display = "none";
      document.body.append(tooltip);
      this.tooltip = tooltip;

      this.element.removeEventListener(
        "mousemove",
        this.updateTooltipPosition.bind(this)
      );
      this.element.addEventListener(
        "mousemove",
        this.updateTooltipPosition.bind(this)
      );
    }

    /**
     * Updates the position of the tooltip based on the mouse cursor's coordinates.
     *
     * @param {MouseEvent} e - The mouse event containing cursor coordinates.
     */
    updateTooltipPosition(e) {
      const tooltip = this.tooltip;
      const screenWidth = window.innerWidth;
      const bodyHeight = document.documentElement.clientHeight;

      // Calculate new positions
      let top = e.clientY + 25;
      let left = e.clientX + 10;

      // Adjust left position if tooltip goes beyond screen width
      if (left + tooltip.offsetWidth > screenWidth - 15) {
        left = e.clientX - tooltip.offsetWidth;
        if (left < 0) left = 0;
      }

      // Adjust top position if tooltip goes beyond body height
      if (top + tooltip.offsetHeight > bodyHeight - 5) {
        top = e.clientY - tooltip.offsetHeight;
      }

      // Apply the new positions
      tooltip.style.top = `${top}px`;
      tooltip.style.left = `${left}px`;
    }

    /**
     * Hides the tooltip by clearing its content and setting its display style to 'none'.
     */
    hideTooltip() {
      const tooltip = this.tooltip;

      if (!tooltip) return;

      tooltip.innerHTML = "";
      tooltip.style.display = "none";
    }

    // method to update tooltip innerHTML
    updateTooltipBody(task) {
      const tooltip = this.tooltip;

      if (!tooltip) return;

      const { start_date, end_date } = this.getLargeAndSmallDate(task);

      const tooltipContent = this.templates.tooltip_text(
        start_date,
        end_date,
        task
      );

      if (tooltipContent !== false) {
        tooltip.innerHTML = tooltipContent;
        tooltip.style.display = "block";
      } else {
        this.hideTooltip();
      }
    }

    /**
     * Checks if the given value is a function.
     *
     * @param {*} value - The value to check.
     * @returns {boolean} - Returns true if the value is a function, otherwise false.
     */
    isFunction(value) {
      return typeof value === "function";
    }

    /**
     * Trims leading and trailing whitespace from a class string,
     * replaces multiple spaces with a single space, and adds the resulting classes to the element.
     *
     * @param {HTMLElement} element - The element to which classes will be added.
     * @param {string} classString - A string containing one or more class names, possibly separated by whitespace.
     */
    addClass(element, classString) {
      if (classString) {
        const classes = classString.trim().replace(/\s+/g, " ").split(" ");
        element.classList.add(...classes);
      }
    }

    /**
     * Checks if the specified property of an object is a function, and if so,
     * calls it with the provided parameters. If the function returns a value,
     * trims whitespace, splits the result by spaces, and adds the resulting classes
     * to the specified element's class list.
     * @param {function} func - The function which return the css classes.
     * @param {HTMLElement} element - The HTML element to which classes will be added.
     * @param {...any} params - Parameters to be passed to the function if it exists.
     */
    addClassesFromFunction(func, element, ...params) {
      if (this.isFunction(func)) {
        // Call the function with the provided parameters
        let cssClass = func(...params);
        this.addClass(element, cssClass);
      }
    }

    /**
     * Method to filter out weekends if fullWeek option is not enabled.
     *
     * @param {Array} dates - Array of date objects to be filtered.
     * @returns {Array} Filtered array of date objects without weekends.
     */
    filterWeekends(dates) {
      const weekday = this.#dateFormat.day_short;
      return dates.filter((date) => {
        const dayName = weekday[new Date(date).getDay()];
        return !this.options.weekends.includes(dayName);
      });
    }

    /**
     * method to select a task row and task
     * @param { Object } task task to select
     */
    selectTask(task) {
      const that = this;
      removeClassFromElements(".zt-gantt-selected", "zt-gantt-selected");
      removeClassFromElements(
        ".zt-gantt-selected-task-bar",
        "zt-gantt-selected-task-bar"
      );

      // Scroll horizontal scroll to the selected task bar
      this.scrollToTask(task.id);

      // Select the current task bar
      const currentTaskBar = this.element.querySelector(
        `[zt-gantt-taskbar-id="${task.id}"]`
      );

      if (currentTaskBar) {
        currentTaskBar.classList.add("zt-gantt-selected-task-bar");
      }

      // Select the task row
      const taskRows = this.element.querySelectorAll(
        `[zt-gantt-task-id="${task.id}"]`
      );

      taskRows.forEach((item) => {
        item.classList.add("zt-gantt-selected");
      });

      // Update selected task in options
      this.options.selectedRow = `${task.id}`;
      this.options.selectedTask = `${task.id}`;

      function removeClassFromElements(selector, className) {
        const elements = that.element.querySelectorAll(selector);
        elements.forEach((element) => {
          element.classList.remove(className);
        });
      }
    }

    /**
     * method to scroll to a perticular task.
     * @param {string | number} taskId
     */
    scrollToTask(taskId) {
      const horizontalScroll = this.element.querySelector(
        ".zt-gantt-hor-scroll"
      );
      const taskBar = this.element.querySelector(
        `[zt-gantt-taskbar-id="${taskId}"]`
      );

      if (taskBar && horizontalScroll) {
        let cellBefore = taskBar.offsetLeft - 80;
        horizontalScroll.scrollLeft = cellBefore < 0 ? 0 : cellBefore;
      }
    }

    /**
     * Determines whether an object has a property with the specified name.
     * @param {Object} obj - The object to check.
     * @param {string} property - The property to check for.
     * @returns {boolean} - true if the property exists on the object, otherwise false.
     */
    hasProperty(obj, property) {
      return Object.prototype.hasOwnProperty.call(obj, property);
    }

    /**
     * @param {string} template - Name of template
     * @param {...any} params - Parameters to be passed to the template if it is a function
     * Method to get template values
     */
    callTemplate(template, ...params) {
      if (this.isFunction(this.templates[template])) {
        return this.templates[template](...params);
      }

      return this.templates[template];
    }

    /**
     * Method to check if a task is not present in the searched data.
     * @param {string | number} taskId - The ID of the task to check.
     * @returns {boolean} - True if the task is not in the searched data, false otherwise.
     */
    isTaskNotInSearchedData(taskId) {
      return !!(this.#searchedData && !this.#searchedData.includes(taskId));
    }

    /**
     * Method to check task is opened of collapsed.
     * @param {number | string} id task id
     */
    isTaskOpened(id) {
      return this.options.openedTasks.includes(id);
    }

    /**
     * Method to add a task to the list of opened tasks.
     * @param {number | string} id task id
     */
    addTaskToOpenedList(id) {
      this.options.openedTasks.push(id);
    }

    /**
     * Method to remove a task from the list of opened tasks.
     * @param {number | string} id task id
     */
    removeTaskFromOpenedList(id) {
      const openedTaskIndex = this.options.openedTasks.indexOf(id);
      if (openedTaskIndex > -1) {
        this.options.openedTasks.splice(openedTaskIndex, 1);
      }
    }
  }

  global.ztGantt = ztGantt;
})(this);

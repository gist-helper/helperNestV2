// legacy!
// for our policy MON - SUN (0 - 6)
// in javasript SUN - SAT (0 - 6)
// in java MON - SUN (1 - 7)
// in mobile app MON - SUN (1 - 7)

export enum Types {
    LANG_KOR = 0,
    LANG_ENG = 1,
    BLDG1_1ST = 0,
    BLDG1_2ND = 1,
    BLDG2_1ST = 2,
    KIND_BREAKFAST = 0,
    KIND_LUNCH = 1,
    KIND_DINNER = 2,
    KIND_LUNCH_CORNER = 3,
    KIND_LUNCH_BLDG1_2 = 4,
    KIND_BREAKFAST_CORNER = 5,
    DATE_MON = 0,
    DATE_TUE = 1,
    DATE_WED = 2,
    DATE_THR = 3,
    DATE_FRI = 4,
    DATE_SAT = 5,
    DATE_SUN = 6,
    BLDG1_MOBLIE = 1,
    BLDG2_MOBLIE = 2,
}

export enum SpecMealInputKor {
    TODAY = "오늘",
    TOMORROW = "내일",
    MON = "월",
    TUE = "화",
    WED = "수",
    THR = "목",
    FRI = "금",
    SAT = "토",
    SUN = "일",
    DAY = "일",
    BREAKFAST = "조식",
    LUNCH = "중식",
    DINNER = "석식"
}

export enum SpecMealInputEng {
    TODAY = "today",
    TOMORROW = "tomorrow",
    MON = "Mon",
    TUE = "Tue",
    WED = "Wed",
    THR = "Thr",
    FRI = "Fri",
    SAT = "Sat",
    SUN = "Sun",
    DAY_1 = "st",
    DAY_2 = "nd",
    DAY_3 = "rd",
    DAY_OTHER = "th",
    BREAKFAST = "breakfast",
    LUNCH = "lunch",
    DINNER = "dinner"
}

export enum ErrorMessage {
    EXIST_MEAL_ERROR = "이미 존재하는 식단입니다. (DB CREATE ERROR)",
    NO_EXIST_MEAL_ERROR = "조건에 맞는 식단이 존재하지 않습니다. (DB SEARCH ERROR)",
    NO_EXIST_DATE_ERROR = "유효하지 않은 날짜입니다. (불가능한 날짜)",
    INVALID_BLDG_ERROR = "유효하지 않은 빌딩 타입입니다. (BldgType can be only 1(1학) or 2(2학))",
    INVALID_LANG_ERROR = "유효하지 않은 언어 타입입니다. (LangType can be only 0(KOR) or 1(ENG))",
    INVALID_DATE_ERROR = "유효하지 않은 날짜 타입입니다. (DateType can be only 1(Mon) to 7(SUN)",
    INVALID_KIND_ERROR = "유효하지 않은 식단 타입입니다. (KindType can be only 0 to 5, refer documnet.",
    INVALID_SPEC_INPUT_ERROR = "정의되지 않은 입력입니다.",
}

export enum MessagesKor {
    NO_MEAL = "식단 준비중입니다.",
    DUMMY_MEAL = "2023-01-27 조식\n\n제2학생회관1층\n\n흰밥*김가루양념밥\n",
    EMPTY_MEAL = "\n",
}

export enum MessagesEng {
    NO_MEAL = "The meal is being prepared.",
    DUMMY_MEAL = "2023-01-27 Breakfast\n\nStudent Union Bldg.2 1st floor\n\nWhite rice*Seasoned rice with seaweed\n",
    EMPTY_MEAL = "\n",
}
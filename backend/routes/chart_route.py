from fastapi import APIRouter
from services.chart_service import get_daily_stats, get_weekly_stats, get_monthly_stats

router = APIRouter()

@router.get("/daily")
def daily_stats():
    return get_daily_stats()

@router.get("/weekly")
def weekly_stats():
    return get_weekly_stats()

@router.get("/monthly")
def monthly_stats():
    return get_monthly_stats()

import React, { useState, useEffect } from 'react';
import { Card, Spin, Empty } from 'antd';
import axios from 'axios';
import weatherStyle from './Weather.module.scss';

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [location, setLocation] = useState(null);

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setLocation({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.error("Error getting location:", error);
                    setError("Unable to get location information. Please allow location access.");
                    setLoading(false);
                }
            );
        } else {
            setError("Your browser does not support geolocation");
            setLoading(false);
        }
    }, []);

    // Get weather data
    useEffect(() => {
        if (location) {
            const fetchWeather = async () => {
                try {
                    const response = await axios.get(
                        `https://api.weatherapi.com/v1/current.json?key=65c9ced0df53453e98f81730252504&q=${location.latitude},${location.longitude}&aqi=no`
                    );
                    setWeatherData(response.data);
                    setLoading(false);
                } catch (err) {
                    console.error("Error fetching weather:", err);
                    setError("Failed to get weather information");
                    setLoading(false);
                }
            };

            fetchWeather();
        }
    }, [location]);

    // Get weather icon URL
    const getWeatherIcon = (conditionCode) => {
        return `https://${conditionCode}`;
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <Card title="Real-time Weather" className={weatherStyle.weatherCard}>
                <div className={weatherStyle.loadingContainer}>
                    <Spin size="large" />
                    <p>Loading weather information...</p>
                </div>
            </Card>
        );
    }

    if (error) {
        return (
            <Card title="Real-time Weather" className={weatherStyle.weatherCard}>
                <Empty description={error} />
            </Card>
        );
    }

    if (!weatherData) {
        return (
            <Card title="Real-time Weather" className={weatherStyle.weatherCard}>
                <Empty description="No weather data available" />
            </Card>
        );
    }

    return (
        <Card title="Real-time Weather" className={weatherStyle.weatherCard}>
            <div className={weatherStyle.weatherContainer}>
                <div className={weatherStyle.weatherMain}>
                    <div className={weatherStyle.weatherIcon}>
                        <img 
                            src={getWeatherIcon(weatherData.current.condition.icon)} 
                            alt={weatherData.current.condition.text} 
                        />
                    </div>
                    <div className={weatherStyle.weatherInfo}>
                        <div className={weatherStyle.temperature}>
                            {weatherData.current.temp_c}°C
                        </div>
                        <div className={weatherStyle.condition}>
                            {weatherData.current.condition.text}
                        </div>
                    </div>
                </div>
                <div className={weatherStyle.weatherDetails}>
                    <div className={weatherStyle.detailItem}>
                        <span className={weatherStyle.detailLabel}>Feels like:</span>
                        <span className={weatherStyle.detailValue}>{weatherData.current.feelslike_c}°C</span>
                    </div>
                    <div className={weatherStyle.detailItem}>
                        <span className={weatherStyle.detailLabel}>Humidity:</span>
                        <span className={weatherStyle.detailValue}>{weatherData.current.humidity}%</span>
                    </div>
                    <div className={weatherStyle.detailItem}>
                        <span className={weatherStyle.detailLabel}>Wind speed:</span>
                        <span className={weatherStyle.detailValue}>{weatherData.current.wind_kph} km/h</span>
                    </div>
                    <div className={weatherStyle.detailItem}>
                        <span className={weatherStyle.detailLabel}>Precipitation:</span>
                        <span className={weatherStyle.detailValue}>{weatherData.current.precip_mm} mm</span>
                    </div>
                </div>
                <div className={weatherStyle.location}>
                    <div className={weatherStyle.locationName}>{weatherData.location.name}, {weatherData.location.country}</div>
                    <div className={weatherStyle.updateTime}>Last updated: {formatDate(weatherData.current.last_updated)}</div>
                </div>
            </div>
        </Card>
    );
};

export default Weather; 
import React, { useEffect, useState } from 'react';
import './index.css'; // Import the styles for the News component

function News() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0); // Track the current article index

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/news'); // URL of your Node.js API
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                const filteredArticles = data.filter(article => article.image && article.headline && article.summary && article.link);
                setArticles(filteredArticles);
            } catch (err) {
                setError('Error fetching news');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    const handleNext = () => {
        if (currentIndex < articles.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    const handleBack = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (loading) return (
        <div className="loading-container">
            <div className="loader"></div> {/* Loading spinner */}
        </div>
    );

    if (error) return <div>{error}</div>;
    if (articles.length === 0) return <div>No articles available</div>;

    const currentArticle = articles[currentIndex];

    return (
        <div className="news-container">
            {currentArticle && (
                <div className="card">
                    <img src={currentArticle.image} alt="Article" />
                    <h3>{currentArticle.headline}</h3>
                    <p>{currentArticle.summary}</p>
                    <div className="link-container">
                        <a href={currentArticle.link} target="_blank" rel="noopener noreferrer">View More</a>
                        <button onClick={handleBack} disabled={currentIndex === 0}>Back</button>
                        <button onClick={handleNext} disabled={currentIndex === articles.length - 1}>Next</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default News;

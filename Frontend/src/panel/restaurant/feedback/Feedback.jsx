// Feedback.js (React Component using Redux)
import { createFeedback, fetchFeedbacks, respondToFeedback } from '@/redux/slice/FeedbackSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


function Feedback() {
    const dispatch = useDispatch();
    const { feedbackData, loading,error } = useSelector(state => state.feedback);
    const [newFeedback, setNewFeedback] = useState({ customerName: '', feedback: '', rating: 1 });
    const [response, setResponse] = useState('');

    console.log("feed",feedbackData);
    

    useEffect(() => {
        dispatch(fetchFeedbacks());
    }, [dispatch]);

    const handleCreateFeedback = () => {
        dispatch(createFeedback(newFeedback));
        setNewFeedback({ customerName: '', feedback: '', rating: 1 });
    };

    const handleRespondToFeedback = (id) => {
        dispatch(respondToFeedback({ id, response }));
        setResponse('');
    };

    const handleDeleteFeedback = (id) => {
        dispatch(deleteFeedback(id));
    };

    return (
        <div>
            <h2>Customer Feedback</h2>
            <div>
                <h3>Submit Feedback</h3>
                <input
                className='bg-white'
                    type="text"
                    placeholder="Your Name"
                    value={newFeedback.customerName}
                    onChange={(e) => setNewFeedback({ ...newFeedback, customerName: e.target.value })}
                />
                <textarea
                className='bg-white'
                    placeholder="Your Feedback"
                    value={newFeedback.feedback}
                    onChange={(e) => setNewFeedback({ ...newFeedback, feedback: e.target.value })}
                />
                <input
                    className='bg-white'
                    type="number"
                    min="1"
                    max="5"
                    value={newFeedback.rating}
                    onChange={(e) => setNewFeedback({ ...newFeedback, rating: e.target.value })}
                />
                <button onClick={handleCreateFeedback}>Submit</button>
            </div>

            <h3>All Feedbacks</h3>
            {loading && <p>Loading...</p>}
            {error && <p>{error} No feedback</p>}
            <ul>
                {feedbackData.map((feedback) => (
                    <li key={feedback._id}>
                        <p>{feedback.customerName}</p>
                        <p>Rating: {feedback.rating}</p>
                        <p>{feedback.feedback}</p>
                        {feedback.response ? (
                            <div>
                                <p><strong>Response:</strong> {feedback.response}</p>
                            </div>
                        ) : (
                            <div>
                                <textarea
                                    placeholder="Your response"
                                    value={response}
                                    onChange={(e) => setResponse(e.target.value)}
                                />
                                <button onClick={() => handleRespondToFeedback(feedback._id)}>Respond</button>
                            </div>
                        )}
                        <button onClick={() => handleDeleteFeedback(feedback._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Feedback;

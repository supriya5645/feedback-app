import {createContext, useState, useEfect, useEffect} from 'react'
import { v4 as uuid4 } from "uuid"


const FeedbackContext = createContext("")


export const FeedbackProvider = ({children}) =>{
  const [isLoading, setIsLoading] = useState(true)



    const [feedback, setFeedback] = useState([])
    const [feedbackEdit, setFeedbackEdit]= useState({
        item:{},
        edit:false

    })

    useEffect(() =>{
      fetchFeedback()
    }, [])
    // Fetch feedback
    const fetchFeedback = async () =>{
      const response = await fetch(`/feedback?_sort=id&_order=desc`)
      const data = await response.json()
      setFeedback(data);
      setIsLoading(false)
    }
    // Add feedback
    const addFeedback =async (newFeedback) => {
      const response  = await fetch('/feedback', {
        method:'POST',
     headers:{
       'content-Type': 'application/json'
     },
     body:JSON.stringify(newFeedback),
    })
    
        newFeedback.id = uuid4();
        
        setFeedback([newFeedback, ...feedback]);
      };
    //   Delete feedback

    const deleteFeedback = (id) => {
        if (window.confirm("Are you sure you want to delete")) {
         
          setFeedback(feedback.filter((item) => item.id !== id))
        }
      }
    //   Update feedback item
    const updateFeedback = async(id, upItem) =>{
      const response = await fetch(`/feedback/${id}`,{
        method:'PUT',
        headers:{
          'Content-Type': 'application/json',
        },
        body:JSON.stringify(upItem)
      })
      const data = await response.json()
      setFeedback(feedback.map((item)=> item.id ===id ? {...item, ...data} : item))
    }
    //   Set item to be updated

      const editFeedback = (item) =>{
          setFeedbackEdit({
             item,
             edit:true 
          })
      }

    return <FeedbackContext.Provider value={{
     feedback,
     deleteFeedback,
     feedbackEdit,
     isLoading,
     addFeedback,
     editFeedback,
     updateFeedback,
    }}>
        {children}
    </FeedbackContext.Provider>
}
export default FeedbackContext
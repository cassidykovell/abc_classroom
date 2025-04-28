import { Link } from "react-router-dom"

const QuestionCard = ({ question }) => {
  return (
    <div className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow bg-white mb-4">
      <Link to={`/discussions/${question._id}`} className="block">
        <h3 className="text-xl font-semibold mb-2 text-gray-800 hover:text-pastel-darkPurple">{question.title}</h3>
      </Link>
      <p className="text-gray-600 mb-2">
        Asked by {question.username} on {question.createdAt}
      </p>
      <p className="mb-4">{question.content.substring(0, 150)}...</p>
      <div className="flex flex-wrap gap-2 mb-4">
        {question.tags.map((tag, index) => (
          <span key={index} className="bg-pastel-yellow text-gray-800 px-2 py-1 rounded-full text-sm">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <span className="text-pastel-blue">
          {question.answerCount} {question.answerCount === 1 ? "answer" : "answers"}
        </span>
        <Link
          to={`/discussions/${question._id}`}
          className="bg-pastel-blue text-gray-800 px-4 py-2 rounded hover:bg-opacity-80"
        >
          View Discussion
        </Link>
      </div>
    </div>
  )
}

export default QuestionCard

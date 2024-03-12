export default function validatePassword(password, trig) {
	// Set up the regex for each character class
	const uppercaseRegex = /[A-Z]/;
	const lowercaseRegex = /[a-z]/;
	const numberRegex = /[0-9]/;
	const specialCharRegex = /[!@#$%^&*()_+-=[]{};':"\|,.<>\/?]/;

	// Check if the password is within the correct length
	if (password.length < 8 || password.length > 32) {
		return false;
	}

	// Check if the password contains characters from at least two character classes
	let classesFound = 0;
	if (uppercaseRegex.test(password)) {
		classesFound++;
	}
	if (lowercaseRegex.test(password)) {
		classesFound++;
	}
	if (numberRegex.test(password)) {
		classesFound++;
	}
	if (specialCharRegex.test(password)) {
		classesFound++;
	}

	if(trig){
		if (classesFound < 3) {
			return false;
		}
	}
	else {
		if (classesFound < 2) {
			return false;
		}
	}

	// If all checks pass, the password is valid
	return true;
}

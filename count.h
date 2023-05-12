#include <iostream>
#include <vector>
#include <algorithm>
#include <string>
#include <pstream.h>
#include <map>

using namespace std;

class DivideZeroException : public std::exception {
public:
    const char *what() const noexcept override {
        return "Error, division by zero";
    }
};

class BigInteger {
private:
    static const int card_of_base = 9;
    static const long long base = 1000000000;
    std::vector<long long> digits;
    long long sign = 1;

    void RemoveZeros() {
        while (digits.size() > 1 && digits.back() == 0) {
            digits.pop_back();
        }
        fixZeroSign();
    }

    bool isFalse() const {
        return digits.size() == 1 && digits[0] == 0;
    }

    bool compareNoSignLess(const BigInteger &other) const {
        if (digits.size() != other.digits.size()) {
            return digits.size() < other.digits.size();
        }
        for (int i = digits.size() - 1; i >= 0; --i) {
            if (digits[i] != other.digits[i]) {
                return (digits[i] < other.digits[i]);
            }
        }
        return false;
    }

    void Shift(size_t n) {
        if (!isFalse()) {
            digits.insert(digits.begin(), n, 0);
        }
    }

    void Swap(BigInteger &other) {
        std::swap(digits, other.digits);
        std::swap(sign, other.sign);
    }

    void fixZeroSign() {
        isFalse() ? sign = 1 : sign *= 1;
    }

    void addNoSign(const BigInteger &biggest, const BigInteger &less, int signum) {
        digits.resize(std::max(biggest.digits.size(), less.digits.size()) + 1);
        long long flag = 0;
        for (size_t i = 0; i < less.digits.size() || flag; ++i) {
            long long cur_digit = flag;
            if (i < biggest.digits.size()) {
                cur_digit += biggest.digits[i];
            }
            if (i < less.digits.size()) {
                cur_digit += signum * less.digits[i];
            }
            if (cur_digit >= base) {
                flag = 1;
                cur_digit -= base;
            } else if (cur_digit < 0) {
                flag = -1;
                cur_digit += base;
            } else {
                flag = 0;
            }
            digits[i] = cur_digit;
        }
        RemoveZeros();
    }

public:

    BigInteger() : digits(std::vector<long long>(1)) {}

    BigInteger(long long number) : sign(number >= 0 ? 1 : -1) {
        number = number >= 0 ? number : -number;
        while (number > 0) {
            digits.push_back(number % base), number /= base;
        }
        if (digits.empty()) {
            digits.resize(1);
        }
    }

    explicit BigInteger(const std::string &num) {
        if (num.length() == 0) {
            sign = 1;
            digits.push_back(0);
        } else {
            int minus_operator = 0;
            if (num[0] == '-') {
                sign = -1, minus_operator = 1;
            }
            digits.resize((num.length() - minus_operator + card_of_base) / card_of_base);
            for (size_t i = 0; i * card_of_base < num.length() - minus_operator; i++) {
                if (num.length() - minus_operator >= card_of_base * (i + 1)) {
                    digits[i] = std::stoi(num.substr(num.length() - (i + 1) * card_of_base, card_of_base));
                } else {
                    digits[i] = std::stoi(num.substr(minus_operator, num.length() - minus_operator - i * card_of_base));
                }
            }
            RemoveZeros();
        }
    }

    bool isNegative() const {
        return sign == -1;
    }

    BigInteger &operator+=(const BigInteger &other) {
        if (sign == other.sign) {
            addNoSign(*this, other, 1);
            return *this;
        }
        if (compareNoSignLess(other)) {
            addNoSign(other, *this, -1);
            sign *= -1;
        } else {
            addNoSign(*this, other, -1);
        }
        return *this;
    }

    BigInteger &operator-=(const BigInteger &other) {
        sign *= -1;
        *this += other;
        sign *= -1;
        fixZeroSign();
        return *this;
    }

    BigInteger &operator*=(const BigInteger &other);

    BigInteger &operator/=(const BigInteger &other);

    BigInteger &operator%=(const BigInteger &other);

    std::string toString() const {
        std::string result;
        result.reserve(digits.size() * card_of_base);
        for (size_t i = 0; i < digits.size(); i++) {
            size_t prev_size = result.size();
            long long copy_digit = digits[i];
            while (copy_digit > 0) {
                result += static_cast<char>(copy_digit % 10 + '0'), copy_digit /= 10;
            }
            if (i != digits.size() - 1) {
                result += std::string(card_of_base + prev_size - result.size(), '0');
            }
        }
        if (result.empty()) {
            result.push_back('0');
        }
        if (isNegative()) {
            result.push_back('-');
        }
        std::reverse(result.begin(), result.end());
        return result;
    }

    BigInteger operator-() const {
        BigInteger result = *this;
        result.sign *= -1;
        result.fixZeroSign();
        return result;
    }

    BigInteger &operator++() {
        return *this += 1;
    }

    BigInteger operator++(int) {
        BigInteger copy = *this;
        *this += BigInteger(1);
        return copy;
    }

    BigInteger &operator--() {
        return *this -= 1;
    }

    BigInteger operator--(int) {
        BigInteger copy = *this;
        *this -= BigInteger(1);
        return copy;
    }

    explicit operator bool() const {
        return !isFalse();
    }

    void clear() {
        sign = 1, digits.resize(1, 0);
    }

    friend std::istream &operator>>(std::istream &in, BigInteger &integer);

    friend bool operator<(const BigInteger &first, const BigInteger &second);

    friend bool operator==(const BigInteger &first, const BigInteger &second);
};

bool operator<(const BigInteger &first, const BigInteger &second) {
    if (first.isNegative() && !second.isNegative()) {
        return true;
    } else if (!first.isNegative() && second.isNegative()) {
        return false;
    }
    return first.isNegative() ? !first.compareNoSignLess(second) : first.compareNoSignLess(second);
}

bool operator<=(const BigInteger &first, const BigInteger &second) {
    return first == second || first < second;
}

bool operator>(const BigInteger &first, const BigInteger &second) {
    return second < first;
}

bool operator!=(const BigInteger &first, const BigInteger &second) {
    return !(first == second);
}

bool operator>=(const BigInteger &first, const BigInteger &second) {
    return !(first < second);
}

bool operator==(const BigInteger &first, const BigInteger &second) {
    return first.sign == second.sign && first.digits == second.digits;
}

std::ostream &operator<<(std::ostream &out, const BigInteger &number) {
    out << number.toString();
    return out;
}

std::istream &operator>>(std::istream &in, BigInteger &integer) {
    integer.clear();
    std::string input;
    in >> input;
    integer = BigInteger(input);
    return in;
}

BigInteger operator ""_bi(const char *p, size_t) {
    return BigInteger(std::string(p));
}

BigInteger operator*(const BigInteger &first, const BigInteger &second) {
    BigInteger result = first;
    return result *= second;
}

BigInteger operator-(const BigInteger &first, const BigInteger &second) {
    BigInteger result(first);
    result -= second;
    return result;
}

BigInteger operator+(const BigInteger &first, const BigInteger &second) {
    BigInteger result(first);
    result += second;
    return result;
}

BigInteger operator/(const BigInteger &first, const BigInteger &second) {
    BigInteger result(first);
    result /= second;
    return result;
}

BigInteger operator%(const BigInteger &first, const BigInteger &second) {
    BigInteger result(first);
    result %= second;
    return result;
}

BigInteger &BigInteger::operator*=(const BigInteger &other) {
    if (*this == 0 || other == 0) {
        return *this = 0;
    }
    if (other == -1 || other == 1) {
        sign *= other.sign;
        return *this;
    }
    std::vector<long long> result(digits.size() + other.digits.size() + 2, 0);
    for (size_t i = 0; i < other.digits.size(); ++i) {
        for (size_t j = 0; j < digits.size(); ++j) {
            result[i + j] += (other.digits[i] * digits[j]);
            if (result[i + j] >= base) {
                result[i + j + 1] += (result[i + j] / base);
                result[i + j] %= base;
            }
        }
    }
    std::swap(digits, result);
    sign *= other.sign;
    RemoveZeros();
    return *this;
}

BigInteger &BigInteger::operator/=(const BigInteger &other) {
    if (other == 0) {
        throw DivideZeroException();
    }
    BigInteger copy_other = other;
    copy_other.sign = 1;
    BigInteger res = 0, current = 0;
    res.digits.resize(digits.size());
    for (int i = digits.size() - 1; i >= 0; --i) {
        current.Shift(1);
        current.digits[0] = digits[i];
        current.RemoveZeros();
        long long val = 0, left = 0, right = base - 1;
        while (left <= right) {
            long long median = (left + right) / 2;
            BigInteger now = copy_other * median;
            if (now <= current) {
                val = median;
                left = median + 1;
            } else {
                right = median - 1;
            }
        }
        res.digits[i] = val;
        current = current - copy_other * static_cast<BigInteger>(val);
    }
    res.sign = sign * other.sign;
    res.RemoveZeros();
    Swap(res);
    return *this;
}

BigInteger &BigInteger::operator%=(const BigInteger &other) {
    BigInteger result = *this - (*this / other) * other;
    // My code starts
    if (result.sign == -1) {
        result += other;
    }
    // My code ends
    Swap(result);
    return *this;
}

BigInteger gcd(const BigInteger &first, const BigInteger &other) {
    return (first == 0 ? other : gcd(other % first, first));
}

BigInteger abs(const BigInteger &value) {
    return value < 0 ? -1 * value : value;
}

BigInteger binpow(const BigInteger &first, const BigInteger &other, const BigInteger &mod) {
	if (other == 0) {
		return BigInteger(1);
	}
	if (other % 2 == 1) {
		return (binpow(first, other - 1, mod) * first) % mod;
	}
	BigInteger cur = binpow(first, other / 2, mod);
	return (cur * cur) % mod;
}

string factor(const BigInteger &first) {
	const string executable = "$HOME/praktikum_backend/msieve -q " + first.toString();
	
	redi::ipstream proc(executable, redi::pstreams::pstdout | redi::pstreams::pstderr);
	string line, res = "";
	while (getline(proc.out(), line)) {
		if (line[0] == 'p') {
			bool flag = false;
			string cur = "";
			for (int i = 0; i < line.size(); ++i) {
				if (flag) {
					cur += line[i];
				}
				if (line[i] == ' ') {
					flag = true;
				}
			}
			res += cur + "   ";
		}
	}
	if (proc.eof() && proc.fail()) {
		proc.clear();
	}
	while (std::getline(proc.err(), line)) {
		cout << line << '\n';
	}

	return res;
}

BigInteger phi(const BigInteger &first) {
	string factr = factor(first);
	map<string, int> mp;
	string cur = "";
	for (auto x : factr) {
		if (x == ' ') {
			++mp[cur];
			cur = "";
		} else {
			cur += x;
		}
	}
	++mp[cur];
	BigInteger res(first);
	for (auto pr : mp) {
		if (pr.first[0] == ' ' || pr.first == "") {
			continue;
		}
		BigInteger cur(pr.first);
		res = (res - (res / cur));
	}
	return res;
}

int inv(int a, int b, int & x, int & y) {
	if (a == 0) {
		x = 0; y = 1;
		return b;
	}
	int x1, y1;
	int d = inv(b%a, a, x1, y1);
	x = y1 - (b / a) * x1;
	y = x1;
	return d;
}

BigInteger find_inv(const BigInteger &first, const BigInteger &other) {
	int a = stoi(first.toString()), m = stoi(other.toString()), x, y;
	int g = inv(a, m, x, y);
	if (g != 1)
		return BigInteger(-500);
	else {
		x = (x % m + m) % m;
		return BigInteger(x);
	}
}

BigInteger div(const BigInteger &first, const BigInteger &other, const BigInteger &mod) {
	BigInteger invMod = find_inv(other, mod);
	return first * invMod;
}




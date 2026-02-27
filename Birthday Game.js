function isTouchDevice() {
	return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

let modifiers = {
	random: {
		isOn: false,
		Quantity: 5,
		text: 'Выбирает определенное количество случайных модификаторов.',
		get html() {
			return `
			<p id="randomOutput">Количество модификаторов: 1</p>
			<input type="range" 
			min="1" 
			max="8"  
			value="` + this.Quantity + `"
			oninput="
			modifiers.random.Quantity = this.value 
			document.getElementById('randomOutput').textContent = 'Количество модификаторов: ' + this.value;
			">
			`
		}
	},
	cheerfulness: {
		isOn: false,
		manaBoost: 1,
		text: 'Восстановление маны в ход увеличивается на определенное количество.',
		get html() {
			return `
			<p id="cheerfulnessOutput">Количество получаемой маны каждый ход: +1</p>
			<input type="range" 
			min="1" 
			max="5"  
			value="` + this.manaBoost + `"
			oninput="
			modifiers.cheerfulness.manaBoost = this.value 
			document.getElementById('cheerfulnessOutput').textContent = 'Количество получаемой маны каждый ход: +' + this.value;
			">
			`
		}
	},
	fire: {
		isOn: false,
		effectStrength: 3,
		text: 'Каждому накладывается эффект burning с определенной силой от 3 до 5.',
		get html() {
			return `
			<p id="fireOutput">Сила эффекта: 3</p>
			<input type="range" 
			min="3" 
			max="5"  
			value="` + this.effectStrength + `"
			oninput="
			modifiers.fire.effectStrength = this.value 
			document.getElementById('fireOutput').textContent = 'Сила эффекта: ' + this.value;
			">
			`
		}
	},
	twoLives: {
		isOn: false,
		fixTheArmor: true,
		restoreMana: true,
		text: 'Каждый персонаж 1 раз возрождается после смерти.',
		get html() {
			return `
			<p>После смерти чинится броня?</p>
			<input type="radio" name="fixTheArmor" id="twoLivesRadio1-1" value="true" class="twoLivesRadio" ${this.fixTheArmor ? 'checked' : ''}><label for="twoLivesRadio1-1">Да</label><br><br>
			<input type="radio" name="fixTheArmor" id="twoLivesRadio2-1" value="false" class="twoLivesRadio" ${!this.fixTheArmor ? 'checked' : ''}><label for="twoLivesRadio2-1" >Нет</label><br><br><br>
			<p>После смерти восстанавливается мана?</p>
			<input type="radio" name="restoreMana" id="twoLivesRadio1-2" value="true" class="twoLivesRadio2" ${this.restoreMana ? 'checked' : ''}><label for="twoLivesRadio1-2">Да</label><br><br>
			<input type="radio" name="restoreMana" id="twoLivesRadio2-2" value="false" class="twoLivesRadio2" ${!this.restoreMana ? 'checked' : ''}><label for="twoLivesRadio2-2" >Нет</label>
			`
		}
	},
	doublePunch: {
		isOn: false,
		text: 'Каждая атака производится дважды за ту же ману.',
		html: ''
	},
	fatigue: {
		isOn: false,
		maxStrength: 2,
		text: 'После траты маны накладывается эффект fatigue, он уменьшает максимум маны в зависимости от силы. Эффект складывается.',
		get html() {
			return `
			<p id="fatigueOutput">Максимальная сила эффекта: 3</p>
			<input type="range" 
			min="2" 
			max="5"  
			value="` + this.maxStrength + `"
			oninput="
			modifiers.fatigue.maxStrength = this.value 
			document.getElementById('fatigueOutput').textContent = 'Максимальная сила эффекта: ' + this.value;
			">
			`
		}
	},
	heal: {
		isOn: false,
		Quantity: 3,
		text: 'Каждый ход ты и твой соперник исцеляете определенное количество хп.',
		get html() {
			return `
			<p id="healOutput">Количество модификаторов: 1</p>
			<input type="range" 
			min="1" 
			max="10"  
			value="` + this.Quantity + `"
			oninput="
			modifiers.heal.Quantity = this.value 
			document.getElementById('healOutput').textContent = 'Количество исцеления за ход: ' + this.value;
			">
			`
		}
	},
	ritual: {
		isOn: false,
		cost: 0.25,
		mana: 2,
		text: 'Каждый ход ты можешь потратить определенное количество своих хп на данный момент (%), чтобы получить определенное количество маны.',
		get html() {
			return `
			<p id="ritualOutput">Стоимость ритуала: 25% текущего здоровья</p>
			<input type="range" 
			min="25" 
			max="90"  
			value="` + Math.round(this.cost * 100) + `"
			oninput="
			modifiers.ritual.cost = this.value / 100
			document.getElementById('ritualOutput').textContent = 'Стоимость ритуала: ' + this.value + '% текущего здоровья'";
			<br><br><br><br><p id="ritualOutput2">Количество получаемой маны за ритуал: 2</p>
			<input type="range" 
			min="1" 
			max="5"  
			value="` + this.mana + `"
			oninput="
			modifiers.ritual.mana = this.value
			document.getElementById('ritualOutput2').textContent = 'Количество получаемой маны за ритуал: ' + this.value
			">
			`
		}
	},
	withoutBorders: {
		isOn: false,
		text: 'Максимума маны, хп и брони нет',
		html: ''
	}
}

let achievements = {
	happyBirthday: {
		title: 'С днём рождения!',
		description: 'С днём рождения, ..., с днём рождения тебяяя!',
		info: 'Впервые зайди в игру',
		image: 'Achievements/Achievement (happy birthday).png',
		isAchieved: localStorage.getItem('happyBirthday1235') === 'true',
		localStorageName: 'happyBirthday1235',
	},
	timeParadox: {
		title: 'Временной парадокс',
		description: 'Что.. неужели.. это же я!!',
		info: 'Сразитесь против самого себя',
		image: 'Achievements/Achievement (time paradox).png',
		isAchieved: localStorage.getItem('timeParadox1235') === 'true',
		localStorageName: 'timeParadox1235',
	},
	kikimamaHasGoneTooFar: {
		title: 'Кикимама зашло слишком далеко..',
		description: '...',
		info: 'Поставьте битву между Кикимама и тыквой или же наоборот',
		image: 'Achievements/Achievement (kikimama has gone too far).png',
		isAchieved: localStorage.getItem('kikimamaHasGoneTooFar1235') === 'true',
		localStorageName: 'kikimamaHasGoneTooFar1235',
	},
	KIKIMAMA: {
		title: 'KIKIMAMA',
		description: 'KIKIMAMA',
		info: 'KIKIMAMA',
		image: 'Achievements/Achievement (kikimama).png',
		isAchieved: localStorage.getItem('kikimama1235') === 'true',
		localStorageName: 'kikimama1235',
	},
	firstWin: {
		title: 'Первая победа',
		description: 'Туда егоооо',
		info: 'Впервые одержи победу над соперником',
		image: 'Achievements/Achievement (first win).png',
		isAchieved: localStorage.getItem('firstWin1235') === 'true',
		localStorageName: 'firstWin1235',
	},
	glitchMeeting: {
		title: 'Встреча двух сбоев',
		description: 'Какая эпичн@я б&тва, не т#к ли, друг м%й?',
		info: 'Поставь битву между [glitch Pumpkin] и [glitch Joker]',
		image: 'Achievements/Achievement (glitch meeting).webp',
		isAchieved: localStorage.getItem('glitchMeeting1235') === 'true',
		localStorageName: 'glitchMeeting1235',
	},
	howDareYou: {
		title: 'ДА КАК ТЫ ПОСМЕЛ?!',
		description: 'ДА КАК ТЫ ПОСМЕЛ?! ТЫ ЧТО СОВСЕМ СТРАХ ПОТЕРЯЛ?!',
		info: 'Одержи победу над разработчиком игры (писал разработчик кстати ;b)',
		image: 'Achievements/Achievement (how dare you).png',
		isAchieved: localStorage.getItem('howDareYou1235') === 'true',
		localStorageName: 'howDareYou1235',
	},
	pacifist: {
		title: 'Пацифист',
		description: 'Не все можно решить разговором.. но попытаться ведь стоит, верно?..',
		info: 'Окончите "сражение" не разу не наносив урона сопернику',
		image: 'Achievements/Achievement (pacifist).png',
		isAchieved: localStorage.getItem('pacifist1235') === 'true',
		localStorageName: 'pacifist1235',
	},
	lastBreath: {
		title: 'Последнее дыхание',
		description: 'Это было близко..',
		info: 'Победите врага с 10 оз или меньше',
		image: 'Achievements/Achievement (last breath).png',
		isAchieved: localStorage.getItem('lastBreath1235') === 'true',
		localStorageName: 'lastBreath1235',
	},
	suicide: {
		title: 'Самоубийство',
		description: 'Что?.. Я только что убил.. самого себя?..',
		info: 'Победите в сражении с самим собой',
		image: 'Achievements/Achievement (suicide).png',
		isAchieved: localStorage.getItem('suicide1235') === 'true',
		localStorageName: 'suicide1235',
	},
	pyromaniac: {
		title: 'Пироманьяк',
		description: 'Добавим в битву огонька)',
		info: 'Нанесите 100 урона эффектом огня',
		image: 'Achievements/Achievement (pyromaniac).png',
		isAchieved: localStorage.getItem('pyromaniac1235') === 'true',
		localStorageName: 'pyromaniac1235',
	},
	invincible: {
		title: 'Непобедимый',
		description: 'Непобеждённый. Непобедимый. Неостановимый.',
		info: 'Выйдите победителем из 10 битв подряд',
		image: 'Achievements/Achievement (invincible).png',
		isAchieved: localStorage.getItem('invincible1235') === 'true',
		localStorageName: 'invincible1235',
	},
	rebirth: {
		title: 'Перерождение',
		description: 'Хах, это не конец. Я лишь разогревался',
		info: 'Используйте вторую жизнь от модификатора "2 жизни"',
		image: 'Achievements/Achievement (rebirth).png',
		isAchieved: localStorage.getItem('rebirth1235') === 'true',
		localStorageName: 'rebirth1235',
	}, 
	iAmMyOwnDoctor: {
		title: 'Сам себе доктор',
		description: 'Пластырь, йод и сила воли.<br>Уже не чувствую я боли',
		info: 'Исцелите 100 оз за 1 битву',
		image: 'Achievements/Achievement (iAmMyOwnDoctor).png',
		isAchieved: localStorage.getItem('iAmMyOwnDoctor1235') === 'true',
		localStorageName: 'iAmMyOwnDoctor1235',
	},
	master: {
		title: 'Мастер',
		description: 'Что, кончились персонажи?',
		info: 'Одержите победу на всех персонажах игры',
		image: 'Achievements/Achievement (master).png',
		isAchieved: localStorage.getItem('master1235') === 'true',
		localStorageName: 'master1235',
		wins: {
			pumpkin: localStorage.getItem('pumpkinWin1235') === 'true',
			joker: localStorage.getItem('jokerWin1235') === 'true',
			shelly: localStorage.getItem('shellyWin1235') === 'true',
			kikimama: localStorage.getItem('kikimamaWin1235') === 'true',
		}
	},
	exorcist: {
		title: 'Экзорцист',
		description: 'Ритуал требует жертвы. К счастью, у меня их было две',
		info: 'Одержите победу с действующими модификаторами 2 жизни и ритуал',
		image: 'Achievements/Achievement (exorcist).png',
		isAchieved: localStorage.getItem('exorcist1235') === 'true',
		localStorageName: 'exorcist1235',
	},
	speed: {
		title: 'Скорость',
		description: 'Кчау',
		info: 'Одержите победу за 3 хода или меньше',
		image: 'Achievements/Achievement (speed).png',
		isAchieved: localStorage.getItem('speed1235') === 'true',
		localStorageName: 'speed1235',
	},
	adhd: {
		title: 'СДВГ',
		description: 'Максимальный уровень хаоса достигнут. Я в восторге и ужасе',
		info: 'Включите все модификаторы и начните битву',
		image: 'Achievements/Achievement (adhd).png',
		isAchieved: localStorage.getItem('adhd1235') === 'true',
		localStorageName: 'adhd1235',
	},
	perfect: {
		title: 'Безупречно',
		description: 'Показал всем, как надо. Теперь придётся соответствовать',
		info: 'Впервые получите S ранг',
		image: 'Achievements/Achievement (perfect).png',
		isAchieved: localStorage.getItem('perfect1235') === 'true',
		localStorageName: 'perfect1235',
	},
	marathon: {
		title: 'Марафон',
		description: 'Похоже у тебя синдром отличника, иначе такое количество S рангов объяснить не могу',
		info: 'Получите 15 S рангов',
		image: 'Achievements/Achievement (marathon).png',
		isAchieved: localStorage.getItem('marathon1235') === 'true',
		localStorageName: 'marathon1235',
	},
	collector: {
		title: 'Коллекционер',
		description: 'Из грязи в князи',
		info: 'Получите все возможные ранги рангов',
		image: 'Achievements/Achievement (collector).png',
		isAchieved: localStorage.getItem('collector1235') === 'true',
		localStorageName: 'collector1235',
		ranks: {
			D: localStorage.getItem('dCounter1235') > 0,
			C: localStorage.getItem('cCounter1235') > 0,
			B: localStorage.getItem('bCounter1235') > 0,
			A: localStorage.getItem('aCounter1235') > 0,
			S: localStorage.getItem('sCounter1235') > 0,
		}
	},
	loser: {
		title: 'Лузер',
		description: 'Не грусти, тебе просто не повезло. Обязательно получится в следующий раз :D',
		info: 'Впервые получите D ранг',
		image: 'Achievements/Achievement (loser).png',
		isAchieved: localStorage.getItem('loser1235') === 'true',
		localStorageName: 'loser1235',
	},
}

$(document).ready(() => {
	let winsCounter = +localStorage.getItem('winsCounter1235')
	let defeatsCounter = +localStorage.getItem('defeatsCounter1235')
	let dCounter = +localStorage.getItem('dCounter1235')
	let cCounter = +localStorage.getItem('cCounter1235')
	let bCounter = +localStorage.getItem('bCounter1235')
	let aCounter = +localStorage.getItem('aCounter1235')
	let sCounter = +localStorage.getItem('sCounter1235')
	console.log(sCounter)

	let winStreak = +localStorage.getItem('winStreak') || 0
	let maxWinStreak = Math.max(winStreak, +localStorage.getItem('maxWinStreak'))
	localStorage.setItem('maxWinStreak', maxWinStreak)

	let defaultPlayerSrc, defaultEnemySrc
	let scoreStyle, score
	let ritualHtml
	let turn
	let win
	let playerHaveSecondLife = true
	let enemyHaveSecondLife = true
	let selectedAttack = false
	let fireCounter = 0
	let healCounter = 0
	let playerSteps = 0
	let isDied = false
	let mobile = isTouchDevice()
	let interval = setInterval(() => {
		mobile = isTouchDevice()
		console.log(mobile)
	}, 100)

	let isItTimeParadox = false
	let isPacifist = true

	let abilityUsed = false
	let attack1Used = false
	let attack2Used = false
	let attack3Used = false
	let ritualUsed = false
	let restoredMana = false

	let attack1Img = document.getElementById('attack1')
	let attack2Img = document.getElementById('attack2')
	let attack3Img = document.getElementById('attack3')
	let ability = document.getElementById('ability')
	let ritualImg = document.getElementById('ritualImg')

	function calculateScore(score1, score2, score3) {
		let averageScore = (score1 + score2 + score3) / 3
		averageScore = averageScore.toFixed(2)
		if (averageScore > 4.5) {
			score = 'S'
			scoreStyle = '#FFD700'
			sCounter += 1
			localStorage.setItem('sCounter1235', sCounter)
			achievements.collector.ranks.S = true
		} else if (averageScore > 3.5) {
			score = 'A'
			scoreStyle = '#4CAF50'
			aCounter += 1
			localStorage.setItem('aCounter1235', aCounter)
			achievements.collector.ranks.A = true
		} else if (averageScore > 2.5) {
			score = 'B'
			scoreStyle = '#FFC107'
			bCounter += 1
			localStorage.setItem('bCounter1235', bCounter)
			achievements.collector.ranks.B = true
		} else if (averageScore > 1.5) {
			score = 'C'
			scoreStyle = '#FF9800'
			cCounter += 1
			localStorage.setItem('cCounter1235', cCounter)
			achievements.collector.ranks.C = true
		} else {
			score = 'D'
			scoreStyle ='#F44336'
			dCounter += 1
			localStorage.setItem('dCounter1235', dCounter)
			achievements.collector.ranks.D = true
		}

		if (
			achievements.collector.ranks.S &&
			achievements.collector.ranks.A &&
			achievements.collector.ranks.B &&
			achievements.collector.ranks.C &&
			achievements.collector.ranks.D &&
			!achievements.collector.isAchieved
		) {
			addAchievement(achievements.collector)
		}

		if (
			sCounter >= 15 &&
			!achievements.marathon.isAchieved
		) {
			addAchievement(achievements.marathon)
		}
	}

	function setRanks() {
		if (win) {
			let stat1Score, stat2Score, stat3Score
			let num1, num2, num3
			let style1, style2, style3


			if (player.hp / player.defaultMaxHp <= 0.1) {
				stat1Score = 'C'
				num1 = 2
				style1 = '#FF9800'
			} else if (player.hp / player.defaultMaxHp <= 0.4) {
				stat1Score = 'B'
				num1 = 3
				style1 = '#FFC107'
			} else if (player.hp / player.defaultMaxHp <= 0.8) {
				stat1Score = 'A'
				num1 = 4
				style1 = '#4CAF50'
			} else {
				stat1Score = 'S'
				num1 = 5
				style1 = '#FFD700'
			}

			if (player.armor / player.defaultMaxArmor == 0) {
				stat2Score = 'D'
				num2 = 1
				style2 = '#F44336'
			} else if (player.armor / player.defaultMaxArmor <= 0.1) {
				stat2Score = 'C'
				num2 = 2
				style2 = '#FF9800'
			} else if (player.armor / player.defaultMaxArmor <= 0.25) {
				stat2Score = 'B'
				num2 = 3
				style2 = '#FFC107'
			} else if (player.armor / player.defaultMaxArmor <= 0.6) {
				stat2Score = 'A'
				num2 = 4
				style2 = '#4CAF50'
			} else {
				stat2Score = 'S'
				num2 = 5
				style2 = '#FFD700'
			}

			if (playerSteps <= 4) {
				stat3Score = 'S'
				num3 = 5
				style3 = '#FFD700'
			} else if (playerSteps <= 8) {
				stat3Score = 'A'
				num3 = 4
				style3 = '#4CAF50'
			} else if (playerSteps <= 12) {
				stat3Score = 'B'
				num3 = 3
				style3 = '#FFC107'
			} else if (playerSteps <= 20) {
				stat3Score = 'C'
				num3 = 2
				style3 = '#F44336'
			} else {
				stat3Score = 'D'
				num3 = 1
				style3 = '#F44336'
			}

			calculateScore(num1, num2, num3)

			$('#rank1').html(`<span class="ranksText">ОЗ игрока: ${player.hp} (${Math.round((+player.hp / +player.defaultMaxHp) * 100)}%)</span><span class="ranksText ranksScore" id="score1" style="color: ${style1}">${stat1Score}</span>`)
			$('#rank2').html(`<span class="ranksText">Броня игрока: ${player.armor} (${Math.round((+player.armor / player.defaultMaxArmor) * 100)}%)</span><span class="ranksText ranksScore" id="score2" style="color: ${style2}">${stat2Score}</span>`)
			$('#rank3').html(`<span class="ranksText">Ходы: ${playerSteps}</span><span class="ranksText ranksScore" id="score4" style="color: ${style3}">${stat3Score}</span>`)

			$('#win').text('Ты победил! :D')

			$('#score').text(score)
			$('#score').css('color', scoreStyle)
		} else {
			let stat1Score, stat2Score, stat3Score
			let num1, num2, num3
			let style1, style2, style3

			if (enemy.hp / enemy.defaultMaxHp <= 0.1) {
				stat1Score = 'B'
				num1 = 3
				style1 = '#FFC107'
			} else if (enemy.hp / enemy.defaultMaxHp <= 0.3) {
				stat1Score = 'C'
				num1 = 2
				style1 = '#FF9800'
			} else {
				stat1Score = 'D'
				num1 = 1
				style1 = '#F44336'
			}

			if (enemy.armor / enemy.defaultMaxArmor <= 0.3) {
				stat2Score = 'C'
				num2 = 2
				style2 = '#FF9800'
			} else {
				stat2Score = 'D'
				num2 = 1
				style2 = '#F44336'
			}

			if (playerSteps <= 8) {
				stat3Score = 'D'
				num3 = 1
				style3 = '#F44336'
			} else if (playerSteps <= 20) {
				stat3Score = 'C'
				num3 = 2
				style3 = '#FF9800'
			} else {
				stat3Score = 'B'
				num3 = 3
				style3 = '#FFC107'
			}

			calculateScore(num1, num2, num3)

			$('#rank1').html(`<span class="ranksText">ОЗ соперника: ${enemy.hp} (${Math.round((+enemy.hp / +enemy.defaultMaxHp) * 100)}%)</span><span class="ranksText ranksScore" id="score1" style="color: ${style1}">${stat1Score}</span>`)
			$('#rank2').html(`<span class="ranksText">Броня соперника: ${enemy.armor} (${Math.round((+enemy.armor / enemy.defaultMaxArmor) * 100)}%)</span><span class="ranksText ranksScore" id="score2" style="color: ${style2}">${stat2Score}</span>`)
			$('#rank3').html(`<span class="ranksText">Продержался ходов: ${playerSteps}</span><span class="ranksText ranksScore" id="score4" style="color: ${style3}">${stat3Score}</span>`)

			$('#win').text('Ты проиграл :(')

			$('#score').text(score)
			$('#score').css('color', scoreStyle)
		}
	}

	function setStats() {
		$('#statsMenu').empty()
		$('#statsMenu').append(
			`
				<p class="statsText">Количество завершенных игр:<b class="statsText"> ${winsCounter + defeatsCounter}</b></p>
				<p class="statsText">Количество побед:<b class="statsText"> ${winsCounter}</b></p>
				<p class="statsText">Количество поражений: ${defeatsCounter}</b></p><br>
				<p class="statsText">Количество S рангов:<b class="statsText"> ${sCounter}</b></p>
				<p class="statsText">Количество A рангов:<b class="statsText"> ${aCounter}</b></p>
				<p class="statsText">Количество B рангов:<b class="statsText"> ${bCounter}</b></p>
				<p class="statsText">Количество C рангов:<b class="statsText"> ${cCounter}</b></p>
				<p class="statsText">Количество D рангов:<b class="statsText"> ${dCounter}</b></p><br>
				<p class="statsText">Серия побед:<b class="statsText"> ${winStreak}</b></p>
				<p class="statsText">Максимальная серия побед:<b class="statsText"> ${maxWinStreak}</b></p>
				<p class="exit">&lt;</p>
			`
		)

		$('.exit').click(() => {
			$('#startMenu').css('display', 'grid')
			$('#achievementsMenu').css('display', 'none')
			$('#statsMenu').css('display', 'none')
		})
	}

	function start() {
		if (modifiers.random.isOn) activateRandomModifiers()
		if (
			modifiers.cheerfulness.isOn &&
			modifiers.doublePunch.isOn &&
			modifiers.fatigue.isOn &&
			modifiers.fire.isOn &&
			modifiers.heal.isOn &&
			modifiers.ritual.isOn &&
			modifiers.twoLives.isOn &&
			modifiers.withoutBorders.isOn &&
			!achievements.adhd.isAchieved
		) {
			addAchievement(achievements.adhd)
		}
		player = createCharacter(cSrc, false)
		enemy = createCharacter(eSrc, true)

		player.setEnemy(enemy)
		enemy.setEnemy(player)

		player.setHover()

		startGame()

		if (modifiers.fire.isOn) {
			if (player.Character != 'Kikimama') player.addEffect('burning', Infinity, modifiers.fire.effectStrength, 5, false)
			if (enemy.Character != 'Kikimama') enemy.addEffect('burning', Infinity, modifiers.fire.effectStrength, 5, false)
		}

		if (yourImg.src == enemyImg.src) {
			if (
				characterSrc == 'Characters and Skins/Kikimama.png' &&
				eSrc == 'Characters and Skins/Kikimama.png'
			) {
				fireJason.play()
				if (!achievements.KIKIMAMA.isAchieved) addAchievement(achievements.KIKIMAMA)
			} else {
				isItTimeParadox = true
				timeParadox.volume = 0.5
				timeParadox.play()
				if (!achievements.timeParadox.isAchieved) {
					addAchievement(achievements.timeParadox)
				}
			}
		} else if (
			(
				characterSrc == 'Characters and Skins/Kikimama.png' &&
				eSrc == 'Characters and Skins/Pumpkin.png'
			) ||
			(
				characterSrc == 'Characters and Skins/Pumpkin.png' &&
				eSrc == 'Characters and Skins/Kikimama.png'
			)
		) {
			kikimamaHasGoneTooFar.volume = 0.5
			kikimamaHasGoneTooFar.play()
			if (!achievements.kikimamaHasGoneTooFar.isAchieved) {
				addAchievement(achievements.kikimamaHasGoneTooFar)
			}
		} else if (
			(
				characterSrc == 'Characters and Skins/Joker (skin - glitch).gif' &&
				eSrc == 'Characters and Skins/Pumpkin (skin - glitch).gif'
			) ||
			(
				characterSrc == 'Characters and Skins/Pumpkin (skin - glitch).gif' &&
				eSrc == 'Characters and Skins/Joker (skin - glitch).gif'
			)
		) {
			glitchFight.volume = 0.5
			glitchFight.play()
			if (!achievements.glitchMeeting.isAchieved) {
				addAchievement(achievements.glitchMeeting)
			}
		}

		$('#selectModifiersMenu').css('display', 'none')
		$('#scene').css('display', 'block')
		if (modifiers.ritual.isOn) { 
			$(ritualImg).css('display', 'block')
			ritualHtml = `<b>Ритуал:</b><p>забирает ${Math.round(modifiers.ritual.cost * 100)}% от текущего здоровья и за это восполняет ману (${modifiers.ritual.mana})</p>`
		}
	}

	function end() {
		timeParadox.pause()
		timeParadox.currentTime = 0
		kikimamaHasGoneTooFar.pause()
		kikimamaHasGoneTooFar.currentTime = 0
		fireJason.pause()
		fireJason.currentTime = 0
		glitchFight.pause()
		glitchFight.currentTime = 0
		
		setRanks()

		$('.attacks').css('pointer-events', 'none')

		$('#ranks').animate({
			opacity: '1'
		})

		$('.rank').each(function(index) {
			$(this).delay(index * 100)
			.queue(function(next) {
				$(this).animate({
					opacity: '1'
				})
				next()
			})
			$('#score').delay(500)
			$('#score').animate({
				opacity: '1'
			}, {
				complete: function () {
					if (score == 'S' && !achievements.perfect.isAchieved) {
						addAchievement(achievements.perfect)
					}
					if (score == 'D' && !achievements.loser.isAchieved) {
						addAchievement(achievements.loser)
					}
				}
			})
		})

		$('#returnToMenu').click(() => {window.location.reload()})
		$('#restart').click(() => {
			stopGame()

			$('#ranks').animate({
				opacity: '0',
			}, 400, function() {
					setTimeout(() => {
						$('.attacks').css('pointer-events', 'auto')
					}, 250)
				})
			
			$('#returnToMenu').css({
				'pointer-events': 'none',
				'opacity': '0'
			})
			$('#restart').css({
				'pointer-events': 'none',
				'opacity': '0'
			})

			setTimeout(() => {
				isGameRestarted = true
				isDied = false
				enemyHaveSecondLife = true
				playerHaveSecondLife = true
				playerSteps = 0
				fireCounter = 0
				healCounter = 0
				abilityUsed = false
				isPacifist = true
				turn = 'you'

				abilityUsed = false
				attack1Used = false
				attack2Used = false
				attack3Used = false
				ritualUsed = false
				restoredMana = false

				if ((player && player.effects) || (enemy && enemy.effects)) {
					player.effects = [];
					$('.effect').css('opacity', '0');
					$('.steps').css('opacity', '0');
				}

				start()
			}, 100) 
		})

		$('#scene').fadeOut(500)

		setTimeout(() => {
			$('#returnToMenu').css('pointer-events', 'auto')
			$('#restart').css('pointer-events', 'auto')

			$('#returnToMenu').animate({
				opacity: '1'
			})
			$('#restart').animate({
				opacity: '1'
			})
		}, 500)
	}

	function randomNumber(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min
	}

	function getPlayerSkinName() {
		if (defaultPlayerSrc == 'Characters and Skins/Pumpkin.png') {
			return 'Pumpkin'
		} else if (defaultPlayerSrc == 'Characters and Skins/Pumpkin (skin - grayscale).png') {
			return 'Pumpkin (skin - grayscale)'
		} else if (defaultPlayerSrc == 'Characters and Skins/Pumpkin (skin - glitch).gif') {
			return 'Pumpkin (skin - glitch)'
		} else if (defaultPlayerSrc == 'Characters and Skins/Joker.png') {
			return 'Joker'
		} else if (defaultPlayerSrc == 'Characters and Skins/Joker (skin - Jevil).png') {
			return 'Joker (skin - Jevil)'
		} else if (defaultPlayerSrc == 'Characters and Skins/Joker (skin - glitch).gif') {
			return 'Joker (skin - glitch)'
		} else if (defaultPlayerSrc == 'Characters and Skins/Kikimama.png') {
			return 'Kikimama'
		} else if (defaultPlayerSrc == 'Characters and Skins/Kikimama (skin - water).png') {
			return 'Kikimama (skin - water)'
		} else if (defaultPlayerSrc == 'Characters and Skins/Kikimama (skin - newYear).png') {
			return 'Kikimama (skin - newYear)'
		} else if (defaultPlayerSrc == 'Characters and Skins/Shelly.png') {
			return 'Shelly'
		} else if (defaultPlayerSrc == 'Characters and Skins/Shelly (skin - Gnurpi).png') {
			return 'Shelly (skin - Gnurpi)'
		} else if (defaultPlayerSrc == 'Characters and Skins/Shelly (skin - nyan).gif') {
			return 'Shelly (skin - nyan)'
		}
	}

	function getEnemySkinName() {
		if (defaultEnemySrc == 'Characters and Skins/Pumpkin.png') {
			return 'Pumpkin'
		} else if (defaultEnemySrc == 'Characters and Skins/Pumpkin (skin - grayscale).png') {
			return 'Pumpkin (skin - grayscale)'
		} else if (defaultEnemySrc == 'Characters and Skins/Pumpkin (skin - glitch).gif') {
			return 'Pumpkin (skin - glitch)'
		} else if (defaultEnemySrc == 'Characters and Skins/Joker.png') {
			return 'Joker'
		} else if (defaultEnemySrc == 'Characters and Skins/Joker (skin - Jevil).png') {
			return 'Joker (skin - Jevil)'
		} else if (defaultEnemySrc == 'Characters and Skins/Joker (skin - glitch).gif') {
			return 'Joker (skin - glitch)'
		} else if (defaultEnemySrc == 'Characters and Skins/Kikimama.png') {
			return 'Kikimama'
		} else if (defaultEnemySrc == 'Characters and Skins/Kikimama (skin - water).png') {
			return 'Kikimama (skin - water)'
		} else if (defaultEnemySrc == 'Characters and Skins/Kikimama (skin - newYear).png') {
			return 'Kikimama (skin - newYear)'
		} else if (defaultEnemySrc == 'Characters and Skins/Shelly.png') {
			return 'Shelly'
		} else if (defaultEnemySrc == 'Characters and Skins/Shelly (skin - Gnurpi).png') {
			return 'Shelly (skin - Gnurpi)'
		} else if (defaultEnemySrc == 'Characters and Skins/Shelly (skin - nyan).gif') {
			return 'Shelly (skin - nyan)'
		}
	}

	function checkEnemyHp() {
		if (enemy.hp < 1) {
			if (modifiers.twoLives.isOn && enemyHaveSecondLife) {

				const $image = $('#enemyCharacterImg');

				$image
				.removeClass('animate-white')
				.offset()

				setTimeout(function() {
				enemyImg.src = defaultEnemySrc
				$image.addClass('animate-white')
				setTimeout(function() {
					$image.removeClass('animate-white')
				}, 500)
				}, 10)

				setTimeout(() => {enemyHaveSecondLife = false}, 10)
				$('#visualEffects').css('background-image', 'radial-gradient(circle at center, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.2))')
				$('#visualEffects').fadeIn(0)
				$('#visualEffects').fadeOut(500)
				enemy.hp = enemy.defaultMaxHp
				if (modifiers.twoLives.fixTheArmor) {
					enemy.armor = enemy.defaultMaxArmor
				}
				if (modifiers.twoLives.restoreMana) {
					if (enemy.Character == "Pumpkin") {
						enemy.abilityMana = 1
						enemy.maxMana = 10
						enemy.defaultMaxMana = 10
						enemy.mana = 10
					} else {
						enemy.mana = player.defaultMaxMana
					}
				}
				enemy.updateUI()
			} else {
				if (!isDied) {
					win = true
					isDied = true
					winStreak += 1
					localStorage.setItem('winStreak', winStreak)

					if (player.Character === "Pumpkin" && !achievements.master.wins.pumpkin) {
						achievements.master.wins.pumpkin = true
						localStorage.setItem('pumpkinWin1235', 'true')
					} else if (player.Character === "Joker" && !achievements.master.wins.joker) {
						achievements.master.wins.joker = true
						localStorage.setItem('jokerWin1235', 'true')
					} else if (player.Character === "Shelly" && !achievements.master.wins.shelly) {
						achievements.master.wins.shelly = true
						localStorage.setItem('shellyWin1235', 'true')
					} else if (player.Character === "Kikimama" && !achievements.master.wins.kikimama) {
						achievements.master.wins.kikimama = true
						localStorage.setItem('kikimamaWin1235', 'true')
					}

					if (achievements.master.wins.pumpkin && 
						achievements.master.wins.joker && 
						achievements.master.wins.shelly && 
						achievements.master.wins.kikimama && 
						!achievements.master.isAchieved) {
						addAchievement(achievements.master);
					}

					if (playerSteps <= 3 && !achievements.speed.isAchieved) {
						addAchievement(achievements.speed)
					}

					if (!achievements.firstWin.isAchieved) {
						addAchievement(achievements.firstWin)
					}
					if (
						eSrc == 'Characters and Skins/Pumpkin.png' &&
						!achievements.howDareYou.isAchieved
					) {
						addAchievement(achievements.howDareYou)
					}
					if (player.hp <= 10 && !achievements.lastBreath.isAchieved) {
						addAchievement(achievements.lastBreath)
					}
					if (isItTimeParadox && !achievements.suicide.isAchieved) {
						addAchievement(achievements.suicide)
					}
					if (winStreak == 10 && !achievements.invincible.isAchieved) {
						addAchievement(achievements.invincible)
					}
					if (modifiers.ritual.isOn && modifiers.twoLives.isOn && !achievements.exorcist.isAchieved) {
						addAchievement(achievements.exorcist)
					}

					winsCounter += 1
					localStorage.setItem('winsCounter1235', winsCounter)

					end()
				}
			}
		}
	}

	function checkPlayerHp() {
		if (player.hp < 1) {
			if (modifiers.twoLives.isOn && playerHaveSecondLife) {
				if (!achievements.rebirth.isAchieved) addAchievement(achievements.rebirth)

				const $image = $('#yourCharacterImg');

				$image
				.removeClass('animate-white')
				.offset()

				setTimeout(function() {
					yourImg.src = defaultPlayerSrc
					$image.addClass('animate-white')
					setTimeout(function() {
						$image.removeClass('animate-white')
					}, 500)
				}, 10)

				setTimeout(() => {playerHaveSecondLife = false}, 1)
				$('#visualEffects').css('background-image', 'radial-gradient(circle at center, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.2))')
				$('#visualEffects').fadeIn(0)
				$('#visualEffects').fadeOut(500)
				player.hp = player.defaultMaxHp
				if (modifiers.twoLives.fixTheArmor) {
					player.armor = player.defaultMaxArmor
				}
				if (modifiers.twoLives.restoreMana) {
					if (player.Character == "Pumpkin") {
						player.abilityMana = 1
						player.maxMana = 10
						enemy.defaultMaxMana = 10
						player.mana = 10
					} else {
						player.mana = player.defaultMaxMana
					}
				}
				player.updateUI()
			} else {
				if (!isDied) {
					win = false
					isDied = true
					winStreak = 0
					localStorage.setItem('winStreak', 0)

					if (!achievements.pacifist.isAchieved && isPacifist) {
						addAchievement(achievements.pacifist)
					}

					defeatsCounter += 1
					localStorage.setItem('defeatsCounter1235', defeatsCounter)

					end()
				}
			}
		}
	}

	function activateRandomModifiers() {
		const quantity = modifiers.random.Quantity;

		const allModifiers = Object.keys(modifiers).filter(key => key !== 'random');

		for (let i = allModifiers.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[allModifiers[i], allModifiers[j]] = [allModifiers[j], allModifiers[i]];
		}

		for (let i = 0; i < quantity; i++) {
			const modifierKey = allModifiers[i];
			modifiers[modifierKey].isOn = true;
		}

		console.log(modifiers)
	}

	class Character {
		constructor(name, isEnemy) {
			this.effects = []
			this.slots = isEnemy ? [
				document.getElementById('enemyEffect1'),
				document.getElementById('enemyEffect2'),
				document.getElementById('enemyEffect3')
			] : [
				document.getElementById('effect1'),
				document.getElementById('effect2'),
				document.getElementById('effect3')
			]
			
			this.name = name
			this.isEnemy = isEnemy

			this.enemy = this.isEnemy ? player : enemy
			
			this.isOn = null

			this.abilityUsed = false

			// Основные характеристики
			this.maxHp = 100
			this.hp = 100
			this.maxArmor = 40
			this.armor = 40
			this.maxMana = 10
			this.mana = 0

			// Атакующие параметры
			this.attack1Mana = 2
			this.attack2Mana = 4
			this.attack3Mana = 6

			// Флаги доступности атак
			this.canUseAttack1 = true
			this.canUseAttack2 = true
			this.canUseAttack3 = true

			this.updateUI()
		}

		setHover() {
			$(attack1Img).on('mouseover', () => {
				$('#attackInfo').html(this.atk1Html)
			})

			$(attack2Img).on('mouseover', () => {
				$('#attackInfo').html(this.atk2Html)
			})

			$(attack3Img).on('mouseover', () => {
				$('#attackInfo').html(this.atk3Html)
			})

			$(ability).on('mouseover', () => {
				$('#attackInfo').html(this.abilityHtml)
			})

			$(ritualImg).on('mouseover', () => {
				$('#attackInfo').html(ritualHtml)
			})
		}

		// Установка противника
		setEnemy(enemy) {
			this.enemy = enemy
		}

		// Обновление интерфейса
		updateUI() {
			const prefix = this.isEnemy ? 'enemy' : 'your'
			if (modifiers.withoutBorders.isOn) {
				$(`#${prefix}Hp`).text(`ОЗ: ${this.hp}`)
				$(`#${prefix}Armor`).text(`Броня: ${this.armor}`)
				$(`#${prefix}Mana`).text(`Мана: ${this.mana}`)
			} else {
				$(`#${prefix}Hp`).text(`ОЗ: ${this.hp}/${this.maxHp}`)
				$(`#${prefix}Armor`).text(`Броня: ${this.armor}/${this.maxArmor}`)
				$(`#${prefix}Mana`).text(`Мана: ${this.mana}/${this.maxMana}`)
			}
		}

		updateEnemyUI() {
			const prefix = this.isEnemy ? 'your' : 'enemy'
			if (modifiers.withoutBorders.isOn) {
				$(`#${prefix}Hp`).text(`ОЗ: ${this.enemy.hp}`)
				$(`#${prefix}Armor`).text(`Броня: ${this.enemy.armor}`)
				$(`#${prefix}Mana`).text(`Мана: ${this.enemy.mana}`)
			} else {
				$(`#${prefix}Hp`).text(`ОЗ: ${this.enemy.hp}/${this.enemy.maxHp}`)
				$(`#${prefix}Armor`).text(`Броня: ${this.enemy.armor}/${this.enemy.maxArmor}`)
				$(`#${prefix}Mana`).text(`Мана: ${this.enemy.mana}/${this.enemy.maxMana}`)
			}
		}

		// Базовая атака
		attack(damage) {
			if (!this.enemy) return

			const prefix = this.isEnemy ? 'your' : 'enemy'

			// Анимация атаки
			this.animateEffect(`#${prefix}Hp`, {
				startColor: 'rgb(255, 0, 0)',
				endColor: 'rgb(255, 255, 255)',
				duration: 250,
			})

			// Расчет урона с учетом брони
			const finalDamage = Math.floor(
				Math.max(damage - Math.min(this.enemy.armor, damage * 0.33), 1)
			)
			this.enemy.takeDamage(finalDamage)
		}

		// Получение урона
		takeDamage(damage) {
			this.hp = Math.max(this.hp - damage, 0)
			this.updateUI()
			checkEnemyHp()
			checkPlayerHp()
		}

		heal(amount, isModifier = false) {
			if (!this.isEnemy && !isModifier) {
				healCounter += Math.min(amount, this.maxHp - this.hp)
				console.log(healCounter)
				if (healCounter >= 100 && !achievements.iAmMyOwnDoctor.isAchieved) {
					addAchievement(achievements.iAmMyOwnDoctor)
				}
			}
			const prefix = this.isEnemy ? 'enemy' : 'your'

			this.hp = Math.min(this.hp + amount, this.maxHp)
			this.updateUI()

			// Анимация лечения
			this.animateEffect(`#${prefix}Hp`, {
				startColor: 'rgb(0, 255, 0)',
				endColor: 'rgb(255, 255, 255)',
				duration: 250,
			})
		}

		breakEnemyArmor(amount) {
			if (!this.enemy) return

			this.enemy.armor = Math.max(this.enemy.armor - amount, 0)
			this.updateEnemyUI()
		}

		breakYourArmor(amount) {
			this.armor = Math.max(this.armor - amount, 0)
			this.updateUI()
		}

		repairArmor(amount) {
			this.armor = Math.min(this.armor + amount, this.maxArmor)
			this.updateUI()
		}

		restoreMana(amount) {
			const prefix = this.isEnemy ? 'enemy' : 'your'

			this.mana = Math.min(this.mana + amount, this.maxMana)
			this.updateUI()

			// Анимация восстановления маны
			this.animateEffect(`#${prefix}Mana`, {
				startColor: 'rgb(0, 0, 255)',
				endColor: 'rgb(255, 255, 255)',
				duration: 250,
			})
		}

		animateEffect(selector, options) {
			let color = options.startColor
			const endColor = options.endColor
			const duration = options.duration
			const interval = duration / 50 // 50 шагов анимации

			let step = 0
			const stepSize = 1 / 50

			const animate = () => {
				if (step >= 1) {
					$(selector).css('color', endColor)
					return
				}

				const r = Math.round(
					this.lerp(this.getR(color), this.getR(endColor), step)
				)
				const g = Math.round(
					this.lerp(this.getG(color), this.getG(endColor), step)
				)
				const b = Math.round(
					this.lerp(this.getB(color), this.getB(endColor), step)
				)

				$(selector).css('color', `rgb(${r}, ${g}, ${b})`)

				step += stepSize
				setTimeout(animate, interval)
			}

			animate()
		}

		getR(color) {
			return parseInt(color.match(/\d+/g)[0])
		}

		getG(color) {
			return parseInt(color.match(/\d+/g)[1])
		}

		getB(color) {
			return parseInt(color.match(/\d+/g)[2])
		}

		lerp(a, b, t) {
			return a + (b - a) * t
		}

		specialAttack1() {}

		specialAttack2() {}

		specialAttack3() {}

		specialAbility() {}

		pasteAttacksSrc() {
			attack1Img.src = this.attack1Src
			attack2Img.src = this.attack2Src
			attack3Img.src = this.attack3Src
			ability.src = this.abilitySrc
		}

		BotAttack() {
			if (!this.enemy) return

			if (this.mana >= this.attack1Mana) {
				this.canUseAttack1 = true
			}
			if (this.mana >= this.attack2Mana) {
				this.canUseAttack2 = true
			}
			if (this.mana >= this.attack3Mana) {
				this.canUseAttack3 = true
			}

			this.useRandomAttack()
		}

		useRandomAttack() {
			this.hpPercent = this.hp / this.maxHp
			this.armorPercent = this.armor / this.maxArmor
			this.manaPercent = this.armor / this.maxArmor
			if (this.mana < this.attack1Mana) {
				this.specialAbility()
				return
			} else if (this.mana < this.attack3Mana) {
				if (this.hp < this.maxHp || this.enemy.armorPercent > 0.5) {
					this.random = randomNumber(1, 2)
					if (this.random == 1) {
						this.specialAbility()
						this.WantUseAttack3 = true
						return
					}
				}
			}
			let canUseAttacks = []
			if (this.canUseAttack1 && this.hpPercent > 0.5) {
				canUseAttacks.push(1)
			}
			if (this.canUseAttack2 && this.hpPercent > 0.5) {
				canUseAttacks.push(2)
			}
			if (this.canUseAttack3) {
				if (this.hp < this.maxHp || this.armor != this.maxArmor) {
					canUseAttacks.push(3)
				}
			}

			if (this.WantUseAttack3) {
				this.specialAttack3()
				return
			}

			if (canUseAttacks.length == 1) {
				if (this.canUseAttack1) {
					this.randomFunction = 1
				} else if (this.canUseAttack2) {
					this.randomFunction = 2
				} else if (this.canUseAttack3) {
					this.randomFunction = 3
				}
			}
			if (this.canUseAttack2) {
				this.randomFunction = randomNumber(
					Math.min(...canUseAttacks),
					Math.max(...canUseAttacks)
				)
			} else {
				this.random = randomNumber(1, 2)
				if (this.random == 1) {
					this.randomFunction = 1
				} else {
					this.randomFunction = 3
				}
			}


			switch (this.randomFunction) {
				case 1:
					this.specialAttack1()
					break
				case 2:
					this.specialAttack2()
					break
				case 3:
					this.specialAttack3()
					break
			}
		}

		addEffect(type, duration, strength, max, shouldSum = false) {
			const existingEffect = this.effects.find(eff => eff.type === type && eff.shouldSum);
			console.log(existingEffect)

			if (existingEffect && shouldSum) {
				existingEffect.strength = Math.min(existingEffect.strength + strength, max)
				existingEffect.duration = Math.max(existingEffect.duration, duration)

				$(`#${existingEffect.slot.id}-steps`).attr('src', `Effects/${existingEffect.duration} step.png`);
				existingEffect.slot.src = `Effects/${type} ${existingEffect.strength}.png`;

				return;
			}

			const slot = this.findFreeSlot();

			if (!slot) {
				console.warn('Нет свободного слота для эффекта');
				return;
			}

			const effect = {
				type: type,
				duration: duration,
				strength: strength,
				slot: slot,
				shouldSum: shouldSum
			};

			this.effects.push(effect);

			slot.src = `Effects/${type} ${strength}.png`;
			$(`#${slot.id}-steps`).attr('src', `Effects/${effect.duration} step.png`);
			slot.style.opacity = '1';
			$(`#${slot.id}-steps`).css('opacity', '1');
		}

		findFreeSlot() {
			for (const slot of this.slots) {
				if ($(slot).css('opacity') == '0') {
					return slot
				}
			}
			return null
		}

		updateEffects() {
			this.effects = this.effects.filter(effect => {
			effect.duration--

			if (effect.type === 'burning') {
				const damage = effect.strength * 2

				if (this.isEnemy) {
					fireCounter += damage
				}

				if (fireCounter >= 100 && !achievements.pyromaniac.isAchieved && !modifiers.fire.isOn) {
					addAchievement(achievements.pyromaniac)
				}

				this.takeDamage(damage)
				this.updateUI()
				checkEnemyHp()
				checkPlayerHp()
			}

			if (effect.type === 'fatigue') {
				if (!modifiers.withoutBorders.isOn) {
					this.maxMana = this.defaultMaxMana - effect.strength
					this.updateUI()
				}
			}


			if (effect.duration <= 0) {
				effect.slot.style.opacity = '0'
				$(`#${effect.slot.id}-steps`).css('opacity', '0')
				console.log(effect.slot.id)
				if (!modifiers.withoutBorders.isOn && effect.type === 'fatigue') {
					this.maxMana = this.defaultMaxMana
					this.updateUI()
				}
				return false
			} else {
				console.log(effect.slot.id)
				$(`#${effect.slot.id}-steps`).attr('src', `Effects/${effect.duration} step.png`)
				return true
			}
			});
		}

		ritual() {
			this.hp -= Math.floor(this.hp * modifiers.ritual.cost)
			this.mana += +modifiers.ritual.mana
			console.log(+modifiers.ritual.mana)
			console.log(this.mana)
			if (this.mana > this.maxMana && !modifiers.withoutBorders.isOn) {
				this.mana = this.maxMana
			}
			this.updateUI()

			const prefix = this.isEnemy ? 'enemy' : 'your'

			this.animateEffect(`#${prefix}Hp`, {
				startColor: 'rgba(99, 53, 53, 1)',
				endColor: 'rgb(255, 255, 255)',
				duration: 250,
			})

			this.animateEffect(`#${prefix}Mana`, {
				startColor: 'rgba(99, 53, 53, 1)',
				endColor: 'rgb(255, 255, 255)',
				duration: 250,
			})
			
			if (!this.isEnemy) {
				$('#visualEffects').css('background-image', 'radial-gradient(circle at center, rgba(0, 0, 0, 0), rgba(255, 0, 0, 0.2))')
				$('#visualEffects').fadeIn(0)
				$('#visualEffects').fadeOut(250)
			}
		}
	}

	class Kikimama extends Character {
		constructor(name, isEnemy) {
			super(name, isEnemy)
			this.Character = "Kikimama"

			this.r = 0
			this.g = 0
			this.b = 0

			this.atk1Html = `<b>атака1 - поджог:</b><p>Накладывает на противника эффект burning I на 3 хода (сила эффекта складывается до 3). Также забирает 1 ману, либо наносит 5 урона, если ее нет. Требует маны: 2</p>`
			this.atk2Html = `<b>атака2 - яростный удар:</b><p>Сносит 5 брони и наносит 20 урона. Требует маны: 3</p>`
			this.atk3Html = `<b>атака3 - комбо мазохиста:</b><p>Наносит сопернику 50% от его хп, игнорируя броню и получает 50% от нанесенного урона. Требует маны: 5</p>`
			this.abilityHtml = `<b>способность - пламенное усиление:</b><p>Усиливает следующую атаку на 20%</p>`

			this.attack1Mana = 2
			this.attack2Mana = 3
			this.attack3Mana = 5

			this.defaultMaxHp = 115
			this.defaultMaxArmor = 15
			this.defaultMaxMana = 7

			if (modifiers.withoutBorders.isOn) {
				this.maxHp = Infinity
				this.maxArmor = Infinity
				this.maxMana = Infinity
			} else {
				this.maxHp = 115
				this.maxArmor = 15
				this.maxMana = 7
			}

			this.hp = 115
			this.armor = 15
			this.mana = 7

			this.hpPercent = this.hp / this.defaultMaxHp
			this.armorPercent = this.armor / this.defaultMaxArmor
			this.manaPercent = this.mana / this.defaultMaxMana

			this.attack1Src = 'Cards/Kikimama atk1 card.png'
			this.attack2Src = 'Cards/Kikimama atk2 card.png'
			this.attack3Src = 'Cards/Kikimama atk3 card.png'
			this.abilitySrc = 'Abilities/Kikimama Ability.png'

			this.random = null
			this.randomFunction = null

			this.enemy = null

			this.boost = false

			this.updateUI()

			if (!this.IsEnemy) {
				this.pasteAttacksSrc()
			}
		}

		specialAttack1() {
			if (this.mana >= this.attack1Mana) {
				if (this.enemy.Character != "Kikimama") {
					this.enemy.addEffect('burning', 3, 1, 3, true)
				}
				this.mana -= this.attack1Mana
				if (this.enemy.mana < 1) {
					this.attack(this.boost ? 6 : 5)
				} else {
					this.enemy.mana -= 1
				}
				this.updateEnemyUI()
				this.updateUI()

				kikimamaAtk1.currentTime = 0
				kikimamaAtk1.play()

				this.boost = false

				if (modifiers.doublePunch.isOn) {
					setTimeout(() => {
						if (this.enemy.Character != "Kikimama") {
							this.enemy.addEffect('burning', 3, 1, 3, true)
						}
						if (this.enemy.mana < 1) {
							this.attack(this.boost ? 6 : 5)
						} else {
							this.enemy.mana -= 1
						}
						this.updateEnemyUI()
						this.updateUI()

						if (modifiers.fatigue.isOn) {
							this.addEffect('fatigue', 2, 1, modifiers.fatigue.maxStrength, true)
						}
					}, 100)
				}

				if (modifiers.fatigue.isOn) {
					this.addEffect('fatigue', 2, 1, modifiers.fatigue.maxStrength, true)
				}

				if (turn == "you") {
					yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} atk1 anim.webp`
				} else {
					enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} atk1 anim.webp`
				}
			}
		}

		specialAttack2() {
			if (this.mana >= this.attack2Mana) {
				this.breakEnemyArmor(5)
				this.attack(this.boost ? 24 : 20)
				this.mana -= this.attack2Mana

				if (modifiers.fatigue.isOn) {
					this.addEffect('fatigue', 2, 1, modifiers.fatigue.maxStrength, true)
				}

				this.updateEnemyUI()
				this.updateUI()

				this.boost = false

				if (modifiers.doublePunch.isOn) {
					setTimeout(() => {
						this.breakEnemyArmor(5)
						this.attack(this.boost ? 24 : 20)
						this.updateEnemyUI()
						this.updateUI()
					}, 100)
				}

				kikimamaAtk2.currentTime = 0
				kikimamaAtk2.play()

				if (turn == "you") {
					yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} atk2 anim.webp`
				} else {
					enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} atk2 anim.webp`
				}
			}
		}

		specialAttack3() {
			if (this.mana >= this.attack3Mana) {
				const prefix = this.isEnemy ? 'your' : 'enemy'
				const damage = this.enemy.hp / 2
				this.enemy.takeDamage(this.boost ? Math.floor(damage * 1.2) : Math.floor(damage))
				this.takeDamage(this.boost ? Math.floor((damage / 2) * 1.2) : Math.floor(damage / 2))
				this.mana -= this.attack3Mana

				this.animateEffect(`#${prefix}Hp`, {
					startColor: 'rgb(255, 0, 0)',
					endColor: 'rgb(255, 255, 255)',
					duration: 250,
				})

				this.updateEnemyUI()
				this.updateUI()

				this.boost = false

				if (modifiers.doublePunch.isOn) {
					setTimeout(() => {
						const damage = this.enemy.hp / 2
						this.enemy.takeDamage(this.boost ? Math.floor(damage * 1.2) : Math.floor(damage))
						this.takeDamage(this.boost ? Math.floor((damage / 2) * 1.2) : Math.floor(damage / 2))

						this.animateEffect(`#${prefix}Hp`, {
							startColor: 'rgb(255, 0, 0)',
							endColor: 'rgb(255, 255, 255)',
							duration: 250,
						})

						this.updateEnemyUI()
						this.updateUI()
					}, 100)
				}

				kikimamaAtk3.currentTime = 0
				kikimamaAtk3.play()

				if (turn == "you") {
					yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} atk3 anim.webp`
				} else {
					enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} atk3 anim.webp`
				}
			}
		}

		specialAbility() {
			kikimamaAbility.currentTime = 0
			kikimamaAbility.play()
			this.boost = true

			if (turn == "you") {
				yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} ability anim.webp`
			} else {
				enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} ability anim.webp`
			}
		}

		BotAttack() {
			if (!this.enemy) return

			if (this.mana >= this.attack1Mana) {
				this.canUseAttack1 = true
			}
			if (this.mana >= this.attack2Mana) {
				this.canUseAttack2 = true
			}
			if (this.mana >= this.attack3Mana) {
				this.canUseAttack3 = true
			}

			this.useRandomAttack()
		}

		useRandomAttack() {
			this.hpPercent = this.hp / this.maxHp
			this.armorPercent = this.armor / this.maxArmor
			this.manaPercent = this.mana / this.maxMana
			if (this.mana >= this.attack3Mana && this.enemy.hp > 50) {
				if (this.boost) {
					this.specialAttack3() 
					return
				} else {
					const random = randomNumber(1, 3)
					if (random != 3) {
						this.specialAttack3()
						return
					}
				}
			} else {
				const random = randomNumber(1, 3)
				const existingBurn = this.enemy.effects.find(eff => eff.type === 'burning')
				if (existingBurn) {
					if ((existingBurn.duration == 1 || random == 3) && this.mana >= this.attack1Mana && this.enemy.Character != 'Kikimama') {
						this.specialAttack1()
						return
					} else {
						const random = randomNumber(1, 2)
						if (this.mana >= this.attack2Mana && random == 1) {
							this.specialAttack2()
						} else {
							this.specialAbility()
						}
					}
				} else {
					if (random == 3 && this.mana >= this.attack1Mana && this.enemy.Character != 'Kikimama') {
						this.specialAttack1()
						return
					} else {
						const random2 = randomNumber(1, 2)
						if (this.mana >= this.attack2Mana && random2 == 1) {
							this.specialAttack2()
						} else {
							this.specialAbility()
						}
					}
				}
			}
		}
	}

	class Shelly extends Character {
		constructor(name, isEnemy) {
			super(name, isEnemy)
			this.Character = "Shelly"

			this.abilityMana = 1

			this.r = 0
			this.g = 0
			this.b = 0

			this.attack1Mana = 2
			this.attack2Mana = 3
			this.attack3Mana = 5

			this.atk1Html = `<b>атака1 - веселая поддержка:</b><p>Исцеляет себе 10 оз и наносит сопернику 6 урона. Требует маны: 2</p>`
			this.atk2Html = `<b>атака2 - zip zip zip:</b><p>Ломает противнику 10 брони и наносит 20 урона. Требует маны: 3</p>`
			this.atk3Html = `<b>атака3 - смайл фэйс:</b><p>Ослепляет своим позитивом. сносит сопернику 12 брони и наносит 30 урона. После этого исцеляет себе 10 оз.Требует маны: 5</p>`
			this.abilityHtml = `<b>способность - свежий раф:</b><p>Восстанавливает 1 ману, 2 оз и 2 брони</p>`


			this.defaultMaxArmor = 25
			this.defaultMaxHp = 75
			this.defaultMaxMana = 9

			if (modifiers.withoutBorders.isOn) {
				this.maxArmor = Infinity
				this.maxHp = Infinity
				this.maxMana =Infinity
			} else {
				this.maxArmor = 25
				this.maxHp = 75
				this.maxMana = 9
			}
			this.armor = 25
			this.hp = 75
			this.mana = 9

			this.isOn = false

			this.hpPercent = this.hp / this.defaultMaxHp
			this.armorPercent = this.armor / this.defaultMaxArmor
			this.manaPercent = this.mana / this.defaultMaxMana

			this.enemy = null

			this.random = null
			this.randomFunction = null

			this.attack1Src = 'Cards/Shelly atk1 card.png'
			this.attack2Src = 'Cards/Shelly atk2 card.png'
			this.attack3Src = 'Cards/Shelly atk3 card.png'
			this.abilitySrc = 'Abilities/Shelly Ability.png'

			this.canUseAttack1 = null
			this.canUseAttack2 = null
			this.canUseAttack3 = null

			this.WantUseAttack3 = null

			this.updateUI()

			if (!this.isEnemy) {
				this.pasteAttacksSrc()
			}
		}

		specialAttack1() {
			if (this.mana >= this.attack1Mana) {
				this.mana -= this.attack1Mana
				this.heal(10)
				this.attack(6)

				this.updateEnemyUI()
				this.updateUI()

				if (modifiers.doublePunch.isOn) {
					setTimeout(() => {
						this.heal(8)
						this.attack(6)
						this.updateEnemyUI()
						this.updateUI()
					}, 100)
				}

				if (turn == "you") {
					yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} atk1 anim.webp`
				} else {
					enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} atk1 anim.webp`
				}
			}
		}

		specialAttack2() {
			if (this.mana >= this.attack2Mana) {
				this.mana -= this.attack2Mana
				this.breakEnemyArmor(10)
				this.attack(20)

				this.updateEnemyUI()
				this.updateUI()

				shellyAtk2.currentTime = 0
				shellyAtk2.play()

				if (modifiers.doublePunch.isOn) {
					setTimeout(() => {
						this.breakEnemyArmor(10)
						this.attack(20)
						this.updateEnemyUI()
						this.updateUI()
					}, 100)
				}

				if (turn == "you") {
					yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} atk2 anim.webp`
				} else {
					enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} atk2 anim.webp`
				}
			}
		}

		specialAttack3() {
			if (this.mana >= this.attack3Mana) {
				this.mana -= this.attack3Mana
				this.breakEnemyArmor(12)
				this.attack(30)
				this.heal(10)

				this.updateEnemyUI()
				this.updateUI()

				shellyAtk3.currentTime = 0
				shellyAtk3.play()

				if (modifiers.doublePunch.isOn) {
					setTimeout(() => {
						this.breakEnemyArmor(12)
						this.attack(30)
						this.heal(10)
						this.updateEnemyUI()
						this.updateUI()
					}, 100)
				}

				if (turn == "you") {
					yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} atk3 anim.webp`
				} else {
					enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} atk3 anim.webp`
				}
			}
		}

		specialAbility() {
			this.restoreMana(1)
			this.repairArmor(2)
			this.heal(2)

			this.updateUI()

			shellyAbility.currentTime = 0
			shellyAbility.play()

			if (modifiers.doublePunch.isOn) {
				setTimeout(() => {
					this.restoreMana(1)
					this.repairArmor(2)
					this.heal(2)
					this.updateUI()
				}, 100)
			}

			if (turn == "you") {
				yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} ability anim.webp`
			} else {
				enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} ability anim.webp`
			}
		}

		useRandomAttack() {
			this.hpPercent = this.hp / this.maxHp
			this.armorPercent = this.armor / this.maxArmor
			this.enemy.armorPercent = this.enemy.armor / this.enemy.maxArmor

			if (this.mana >= this.attack3Mana) {
				this.specialAttack3()
				return
			}

			if (this.hpPercent < 0.2 && this.mana >= this.attack1Mana) {
				this.specialAttack1()
				return
			} else if (
				this.enemy.armorPercent > 0.5 &&
				this.mana >= this.attack2Mana
			) {
				this.random = randomNumber(1, 2)
				if (this.random == 1) {
					this.specialAttack2()
					return
				}
			} else {
				this.random = randomNumber(1, 2)
				if (this.random == 1) {
					if (this.mana >= this.attack3Mana) {
						this.specialAttack3()
						return
					} else {
						this.WantUseAttack3 = true
						this.specialAbility()
						return
					}
				}
			}

			const availableAttacks = []

			if (this.mana >= this.attack1Mana) availableAttacks.push(1)
			if (this.mana >= this.attack2Mana) availableAttacks.push(2)
			if (this.mana >= this.attack3Mana) availableAttacks.push(3)

			if (availableAttacks.length === 0) {
				this.specialAbility()
				return
			}

			const randomAttack =
				availableAttacks[Math.floor(Math.random() * availableAttacks.length)]

			switch (randomAttack) {
				case 1:
					this.specialAttack1()
					break
				case 2:
					this.specialAttack2()
					break
				case 3:
					this.specialAttack3()
					break
			}
		}
	}

	class Pumpkin extends Character {
		constructor(name, isEnemy) {
			super(name, isEnemy)
			this.Character = "Pumpkin"

			this.abilityMana = 1

			this.r = 0
			this.g = 0
			this.b = 0

			this.attack1Mana = 2
			this.attack2Mana = 4
			this.attack3Mana = -100

			this.atk1Html = `<b>атака1 - сверкающий глаз:</b><p>Чинит 7 брони и исцеляет 7 оз. Требует маны: 2</p>`
			this.atk2Html = `<b>атака2 - сияние морской волны:</b><p>Смывает 10 брони сопернику, а после наносит 15 урона. Требует маны: 4</p>`
			this.atk3Html = `<b>атака3 - восстановление:</b><p>Восполняет ману до 10, но увеличивает трату энергии со способности на 1. Также наносит 10 урона. Требует оз: 10</p>`
			this.abilityHtml = `<b>способность - раскат молнии:</b><p class="bigText">Если макс энергии больше чем 3, то уменьшает макс на 1 и сносит сопернику 5 брони, наносит 15 урона и восстанавливает 1 оз. Также накладывает эффект burning I на 1 ход</p>`

			this.defaultMaxArmor = 30
			this.defaultMaxHp = 80
			this.defaultMaxMana = 10

			if (modifiers.withoutBorders.isOn) {
				this.maxArmor = Infinity
				this.maxHp = Infinity
				this.maxMana = Infinity
			} else {
				this.maxArmor = 30
				this.maxHp = 80
				this.maxMana = 10
			}

			this.armor = 30
			this.hp = 80
			this.mana = 10

			this.isOn = false

			this.hpPercent = this.hp / this.defaultMaxHp
			this.armorPercent = this.armor / this.defaultMaxArmor
			this.manaPercent = this.mana / this.defaultMaxMana

			this.enemy = null

			this.random = null
			this.randomFunction = null

			this.attack1Src = 'Cards/Pumpkin atk1 card.png'
			this.attack2Src = 'Cards/Pumpkin atk2 card.png'
			this.attack3Src = 'Cards/Pumpkin atk3 card.png'
			this.abilitySrc = 'Abilities/Pumpkin Ability.png'

			this.canUseAttack1 = null
			this.canUseAttack2 = null
			this.canUseAttack3 = null

			this.WantUseAttack3 = null

			this.updateUI()

			if (!this.IsEnemy) {
				this.pasteAttacksSrc()
			}
		}

		specialAttack1() {
			if (this.mana >= this.attack1Mana) {
				this.repairArmor(7)
				this.heal(7)
				this.mana -= this.attack1Mana
				this.updateUI()
				this.updateEnemyUI()

				pumpkinAtk1.currentTime = 0
				pumpkinAtk1.play()

				if (modifiers.doublePunch.isOn) {
					setTimeout(() => {
						this.repairArmor(7)
						this.heal(7)
						this.updateUI()
						this.updateEnemyUI()
					}, 100)
				}

				if (turn == "you") {
					yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} atk1 anim.webp`
				} else {
					enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} atk1 anim.webp`
				}
			}
		}

		specialAttack2() {
			if (this.mana >= this.attack2Mana) {
				this.breakEnemyArmor(10)
				this.attack(15)
				this.mana -= this.attack2Mana
				this.updateUI()
				this.updateEnemyUI()

				pumpkinAtk2.volume = 0.8
				pumpkinAtk2.currentTime = 0
				pumpkinAtk2.play()

				if (modifiers.doublePunch.isOn) {
					setTimeout(() => {
						this.breakEnemyArmor(10)
						this.attack(15)
						this.updateUI()
						this.updateEnemyUI()
					}, 100)
				}

				if (turn == "you") {
					yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} atk2 anim.webp`
					enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} sink.webp`
				} else {
					enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} atk2 anim.webp`
					yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} sink.webp`
				}
			}
		}

		specialAttack3() {
			if (this.mana >= this.attack3Mana) {
				this.takeDamage(10)
				this.attack(10)
				this.abilityMana += 1
				this.maxMana = 10
				this.mana = 10
				this.updateUI()

				pumpkinAtk3.currentTime = 0
				pumpkinAtk3.play()

				if (modifiers.doublePunch.isOn) {
					setTimeout(() => {
						this.attack(10)
						this.abilityMana += 1
						this.maxMana = 10
						this.mana = 10
						this.updateUI()
					}, 100)
				}

				if (turn == "you") {
					yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} atk3 anim.webp`
				} else {
					enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} atk3 anim.webp`
				}
			}
		}

		specialAbility() {
			if (this.maxMana > 3) {
				this.maxMana -= this.abilityMana
				if (this.mana > this.maxMana) {
					this.mana = this.maxMana
				}
				if (this.enemy.Character != "Kikimama") {
					this.breakEnemyArmor(5)
					this.attack(15)
					this.enemy.addEffect('burning', 1, 1, 1, false)
				}
				this.heal(1)
				this.updateUI()
				this.updateEnemyUI()

				pumpkinAbility.volume = 0.7
				pumpkinAbility.currentTime = 0
				pumpkinAbility.play()

				if (modifiers.doublePunch.isOn) {
					setTimeout(() => {
						if (this.enemy.Character != "Kikimama") {
							this.breakEnemyArmor(5)
							this.attack(15)
						}
						this.heal(1)
						this.updateUI()
						this.updateEnemyUI()
					}, 100)
				}

				if (turn == "you") {
					yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} ability anim.webp`
					enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} burn.webp`
				} else {
					enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} ability anim.webp`
					yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} burn.webp`
				}
			}
		}

		useRandomAttack() {
			const hpPercent = this.hp / this.maxHp;
			const enemyArmorPercent = this.enemy.armor / this.enemy.maxArmor;

			const weightedActions = [];

			if (this.maxMana > 3 && this.enemy.Character !== 'Kikimama') {
				weightedActions.push({ action: 'ability', weight: 50 });

				if (enemyArmorPercent > 0.7) {
					weightedActions.push({ action: 'ability', weight: 20 });
				}

				if (hpPercent > 0.3 && hpPercent < 0.7) {
					weightedActions.push({ action: 'ability', weight: 15 });
				}
			}

			if (this.mana >= this.attack1Mana) {
				if (hpPercent < 0.4) {
					weightedActions.push({ action: 'attack1', weight: 50 });
				} else {
					weightedActions.push({ action: 'attack1', weight: 20 });
				}
			}

			if (this.mana >= this.attack2Mana) {
				if (enemyArmorPercent === 1) {
					weightedActions.push({ action: 'attack2', weight: 60 })
				} else if (enemyArmorPercent > 0.5) {
					weightedActions.push({ action: 'attack2', weight: 30 })
				} else {
					weightedActions.push({ action: 'attack2', weight: 10 })
				}
			}

			if (
				this.mana < 5 &&
				this.hp > 10 &&
				this.mana >= this.attack3Mana &&
				this.enemy.Character !== 'Kikimama'
			) {
				weightedActions.push({ action: 'attack3', weight: 40 });
			}

			if (weightedActions.length === 0) {
				if (this.maxMana > 3 && this.enemy.Character !== 'Kikimama') {
					this.specialAbility();
					return;
				} else {
					const availableAttacks = [1, 2, 3].filter(id => {
						if (id === 1) return this.mana >= this.attack1Mana;
						if (id === 2) return this.mana >= this.attack2Mana;
						if (id === 3) return this.mana >= this.attack3Mana && this.hp > 10 && this.enemy.Character !== 'Kikimama';
					});
					if (availableAttacks.length > 0) {
						const attackId = availableAttacks[Math.floor(Math.random() * availableAttacks.length)];
						this[`specialAttack${attackId}`]();
						return;
					}
				}
			}

			const totalWeight = weightedActions.reduce((sum, a) => sum + a.weight, 0);
			let randomWeight = Math.random() * totalWeight;
			
			for (const action of weightedActions) {
				randomWeight -= action.weight;
				if (randomWeight <= 0) {
					switch (action.action) {
						case 'ability':
							this.specialAbility();
							return;
						case 'attack1':
							this.specialAttack1();
							return;
						case 'attack2':
							this.specialAttack2();
							return;
						case 'attack3':
							this.specialAttack3();
							return;
					}
				}
			}

			this.specialAbility();
		}
	}

	class Joker extends Character {
		constructor(name, isEnemy) {
			super(name, isEnemy)
			this.dodge = false
			this.wantUse = null

			this.Character = "Joker"

			this.r = 0
			this.g = 0
			this.b = 0

			this.attack1Mana = 3
			this.attack2Mana = 6
			this.attack3Mana = 8

			this.atk1Html = `<b>атака1 - волчок свободы:</b><p>Сносит 10 брони, а после этого наносит 20 урона сопернику. Требует маны: 3</p>`
			this.atk2Html = `<b>атака2 - кегли мести:</b><p>Запускает в соперника от 2 до 5 кегль. 1 кегля сносит единицу брони и наносит 10 урона. Требует маны: 6</p>`
			this.atk3Html = `<b>атака3 - масти, масти!:</b><p>Воспроизводит 2 случайных события из 4: исцеление (20), атака (40), увеличение максимума брони (7), поломка брони соперника (15). Требует маны: 8</p>`
			this.abilityHtml = `<b>способность - ловкость шута:</b><p>восполняет 1 ману, уклоняется от 30 % урона следующей атаки/эффекта (шанс 3% — полный уклон)</p>`

			this.defaultMaxArmor = 5
			this.defaultMaxHp = 70
			this.defaultMaxMana = 13

			if (modifiers.withoutBorders.isOn) {
				this.maxArmor = Infinity
				this.maxHp = Infinity
				this.maxMana = Infinity
			} else {
				this.maxArmor = 5
				this.maxHp = 70
				this.maxMana = 13
			}

			this.armor = 5
			this.hp = 70
			this.mana = 13

			this.isOn = false

			this.hpPercent = this.hp / this.defaultMaxHp
			this.armorPercent = this.armor / this.defaultMaxArmor
			this.manaPercent = this.mana / this.defaultMaxMana

			this.enemy = null

			this.random = null
			this.randomFunction = null

			this.attack1Src = 'Cards/Joker atk1 card.png'
			this.attack2Src = 'Cards/Joker atk2 card.png'
			this.attack3Src = 'Cards/Joker atk3 card.png'
			this.abilitySrc = 'Abilities/Joker Ability.png'

			this.canUseAttack1 = null
			this.canUseAttack2 = null
			this.canUseAttack3 = null

			this.WantUseAttack3 = null

			this.updateUI()

			if (!this.IsEnemy) {
				this.pasteAttacksSrc()
			}
		}

		specialAttack1() {
			if (this.mana >= this.attack1Mana) {
				this.mana -= this.attack1Mana
				this.breakEnemyArmor(10)
				this.attack(20)
				this.updateEnemyUI()
				this.updateUI()

				jokerAtk1.currentTime = 0
				jokerAtk1.play()

				if (modifiers.doublePunch.isOn) {
					setTimeout(() => {
						this.breakEnemyArmor(10)
						this.attack(20)
						this.updateEnemyUI()
						this.updateUI()
					}, 100)
				}

				if (turn == "you") {
					yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} atk1 anim.webp`
				} else {
					enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} atk1 anim.webp`
				}
			}
		}

		specialAttack2() {
			if (this.mana >= this.attack2Mana) {
				this.mana -= this.attack2Mana
				const howMany = randomNumber(2, 5)
				setTimeout(() => {
					for (let i = 0; i < howMany; i++) {
						setTimeout(() => {
							this.breakEnemyArmor(1)
							this.attack(10)
							this.updateEnemyUI()
							jokerAtk2.currentTime = 0
							jokerAtk2.play()
						}, i * 100)
					}
				}, 200)

				if (modifiers.doublePunch.isOn) {
					setTimeout(() =>{
						for (let i = 0; i < howMany; i++) {
							setTimeout(() => {
								this.breakEnemyArmor(1)
								this.attack(10)
								this.updateEnemyUI()
								jokerAtk2.currentTime = 0
								jokerAtk2.play()
							}, i * 100)
						}
					}, 400 + howMany * 100)
				}
				this.updateUI()

				if (turn == "you") {
				yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} atk2 anim.webp`
				} else {
					enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} atk2 anim.webp`
				}
			}
		}

		specialAttack3() {
			if (this.mana >= this.attack3Mana) {
				this.mana -= this.attack3Mana

				const functionConfigs = [
					{ fn: this.heal.bind(this), args: [20] },
					{ fn: this.attack.bind(this), args: [40] },
					{ fn: this.boostArmor.bind(this), args: [7] },
					{ fn: this.breakEnemyArmor.bind(this), args: [15] }
				]

				const indices = [0, 1, 2, 3]
				for (let i = indices.length - 1; i > 0; i--) {
					const j = randomNumber(0, i);
					[indices[i], indices[j]] = [indices[j], indices[i]];
				}

				const firstIndex = indices[0]
				const secondIndex = indices[1]

				const { fn: firstFn, args: firstArgs } = functionConfigs[firstIndex];
				const { fn: secondFn, args: secondArgs } = functionConfigs[secondIndex];

				firstFn(...firstArgs)
				secondFn(...secondArgs)
				
				if (modifiers.doublePunch.isOn) {
					setTimeout(() => {
						firstFn(...firstArgs)
						secondFn(...secondArgs)
					}, 100)
				}


				this.updateUI()
				this.updateEnemyUI()
				jokerAtk3.currentTime = 0
				jokerAtk3.play()

				if (turn == "you") {
				yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} atk3 anim.webp`
				} else {
					enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} atk3 anim.webp`
				}
			}
		}

		specialAbility() {
			this.restoreMana(1)
			this.dodge = true
			jokerAbility.currentTime = 0
			jokerAbility.play()

			if (modifiers.doublePunch.isOn) {
				setTimeout(() => {
					this.restoreMana(1)
				}, 100)
			}

			if (turn == "you") {
				yourImg.src = `Anim Sprites/${getPlayerSkinName()}/${getPlayerSkinName()} ability anim.webp`
			} else {
				enemyImg.src = `Anim Sprites/${getEnemySkinName()}/${getEnemySkinName()} ability anim.webp`
			}
		}

		useRandomAttack() {
			const random = randomNumber(1, 4)
			if (random == 1 && this.wantUse == null && this.mana >= this.attack1Mana) {
				this.specialAttack1()
				return
			} else if (this.enemy.hp > 20) {
				if (this.wantUse == null) [
					this.wantUse = randomNumber(2, 3)
				]
				if (this.wantUse == 2) {
					if (this.mana >= this.attack2Mana) {
						this.specialAttack2()
						this.wantUse = null
						return
					} else {
						this.specialAbility()
						return
					}
				} else if (this.wantUse == 3) {
					if (this.mana >= this.attack3Mana) {
						this.specialAttack3()
						this.wantUse = null
						return
					} else {
						this.specialAbility()
						return
					}
				}
			} else {
				if (this.mana >= this.attack1Mana) {
					this.specialAttack1()
					return
				} else {
					this.specialAbility()
					return
				}
			}
		}

		takeDamage(damage) {
			let finalDamage = damage
			const random = randomNumber(1, 100)
			if (this.dodge) {
				if (random < 4) {
					finalDamage = 0
				} else {
					finalDamage = Math.floor(finalDamage * 0.7)
				}
			}
			this.dodge = false
			this.hp = Math.max(this.hp - finalDamage, 0)
			checkEnemyHp()
			checkPlayerHp()
			this.updateUI()
		}

		boostArmor(armor) {
			this.defaultMaxArmor += armor
			this.maxArmor += armor
			this.armor = this.defaultMaxArmor
			this.updateUI()
		}

		attack(damage) {
			if (!this.enemy) return

			const prefix = this.isEnemy ? 'your' : 'enemy'

			// Анимация атаки
			this.animateEffect(`#${prefix}Hp`, {
				startColor: 'rgb(255, 0, 0)',
				endColor: 'rgb(255, 255, 255)',
				duration: 250,
			})

			// Расчет урона с учетом брони
			let finalDamage = Math.floor(
				Math.max(damage - Math.min(this.enemy.armor, damage * 0.33), 1)
			)
			if (this.hp < 10) {
				finalDamage *= 1.6
			}
			this.enemy.takeDamage(Math.floor(finalDamage))
		}
	}

	const characters = [
		document.getElementById('joker') || null,
		document.getElementById('kikimama') || null,
		document.getElementById('pumpkin') || null,
		document.getElementById('shelly') || null,
	]

	const characterClasses = {
		'Characters and Skins/Joker.png': Joker,
		'Characters and Skins/Joker (skin - Jevil).png': Joker,
		'Characters and Skins/Joker (skin - glitch).gif': Joker,
		'Characters and Skins/Kikimama.png': Kikimama,
		'Characters and Skins/Kikimama (skin - water).png': Kikimama,
		'Characters and Skins/Kikimama (skin -  newYear).png': Kikimama,
		'Characters and Skins/Pumpkin.png': Pumpkin,
		'Characters and Skins/Pumpkin (skin - glitch).gif': Pumpkin,
		'Characters and Skins/Pumpkin (skin - grayscale).png': Pumpkin,
		'Characters and Skins/Shelly.png': Shelly,
		'Characters and Skins/Shelly (skin - Gnurpi).png': Shelly,
		'Characters and Skins/Shelly (skin - nyan).gif': Shelly,
	}

	function getCharacterClass(src) {
		return characterClasses[src] || Kikimama // по умолчанию базовый класс
	}

	let player, enemy

	function createCharacter(src, isEnemy) {
		const CharacterClass = getCharacterClass(src)
		return new CharacterClass('Character', isEnemy)
	}

	function addAchievement(ach) {
		ach.isAchieved = true
		localStorage.setItem(ach.localStorageName, true)
		
		const $newImg = $('<img>', {
			src: ach.image,
			alt: 'achievement',
			class: 'lookAchievement',
		}).hide()
	
		$('#lookAchievementsGrid').append($newImg)
		$($newImg).fadeIn(1000)
		setTimeout(() => {
			$($newImg).fadeOut(1000)
		}, 2000)
	}

	function setSrcAch() {
		for (const [key, data] of Object.entries(achievements)) {
			// Находим элемент по ID (например, #happyBirthday)
			const element = document.getElementById(key);
			
			// Проверяем, существует ли элемент и есть ли у пользователя достижение
			if (element && data.isAchieved) {
			element.src = data.image;
			}
		}
	}

	if (!achievements.happyBirthday.isAchieved) {
		addAchievement(achievements.happyBirthday)
	}

	for (const [key, data] of Object.entries(achievements)) {
	// Формируем селектор (например, #happyBirthday, #anotherAchievement)
	const selector = `#${key}`;
	
	$(selector).hover(() => {
		// Проверяем, получено ли достижение (предполагаем, что есть объект achStatus)
		
		if (data.isAchieved) {
		$('#achievementsInfo').html(`
			<b class="achHeading">${data.title}</b>
			<p class="achDescription">${data.description}</p>
			<p class="achInfo">${data.info}</p>
		`);
		} else {
		$('#achievementsInfo').html(`
			<b class="achHeading">${data.title}</b>
			<p class="achDescription">???</p>
			<p class="achInfo">???</p>
		`);
		}
	});
	}


	let dataId
	let modifierId

	$('.modifier').click(function() {
		dataId = $(this).attr('data-id')
		modifierId = $(this).attr('id')
		$('#modifiersInfo').empty()
		$('#modifiersInfo').append(
            `<h1 id="modifierName">Модификатор</h1>
            <p id="modifierText"></p><br>
			<img class="add" src="Imgs/Add.png">` +
			modifiers[dataId].html
		)
		$('.twoLivesRadio').on('change', function() {
			modifiers.twoLives.fixTheArmor = $(this).val() === 'true';
			console.log(modifiers.twoLives.fixTheArmor)
		})
		$('.twoLivesRadio2').on('change', function() {
			modifiers.twoLives.restoreMana = $(this).val() === 'true';
			console.log(modifiers.twoLives.restoreMana)
		})
		if ($('#randomOutput')) {
			$('#randomOutput').text(`Количество модификаторов: ${modifiers.random.Quantity}`)
		}
		if ($('#cheerfulnessOutput')) {
			$('#cheerfulnessOutput').text(`Количество получаемой маны каждый ход: +${modifiers.cheerfulness.manaBoost}`)
		}
		if ($('#fireOutput')) {
			$('#fireOutput').text(`Сила эффекта: ${modifiers.fire.effectStrength}`)
		}
		if ($('#fatigueOutput')) {
			$('#fatigueOutput').text(`Максимальная сила эффекта: ${modifiers.fatigue.maxStrength}`)
		}
		if ($('#healOutput')) {
			$('#healOutput').text(`Количество исцеления за ход: ${modifiers.heal.Quantity}`)
		}
		if ($('#ritualOutput')) {
			$('#ritualOutput').text(`Стоимость ритуала: ${Math.round(modifiers.ritual.cost * 100)}% текущего здоровья`)
		}
		if ($('#ritualOutput2')) {
			$('#ritualOutput2').text(`Количество получаемой маны за ритуал: ${modifiers.ritual.mana}`)
		}
		$('.modifier').css('transform', 'translateX(0)')
		$(this).css('transform', 'translateX(-1vw)')
		$('.add').css('display', 'block')
		$('#modifierName').css('display', 'block')
		$('#modifierName').text($(this).attr('data-name'))
		$('#modifierText').text(modifiers[dataId].text)

		$('.add').click(function() {
			if ($('#selectedModifiers').find(`#${dataId}`).length == 0 && $('#selectedModifiers').find(`#random`).length == 0) {
				if (dataId == "random") {
					$('#selectedModifiers').empty()
					modifiers.cheerfulness.isOn = false
					modifiers.doublePunch.isOn = false
					modifiers.fatigue.isOn = false
					modifiers.fire.isOn = false
					modifiers.heal.isOn = false
					modifiers.ritual.isOn = false
					modifiers.twoLives.isOn = false
					modifiers.withoutBorders.isOn = false
				}
				modifiers[dataId].isOn = true
				$('#selectedModifiers').append(`<img class="selectedModifier" src="${$(`#${modifierId}`).attr('src')}" id="${dataId}">`)
				$('.selectedModifier').click(function() {
					modifiers[$(this).attr('id')].isOn = false
					$(this).remove()
				})
			}
		})
	})

	let jokerAtk1 = new Audio('SFX/Joker atk1.mp3')
	let jokerAtk2 = new Audio('SFX/Joker atk2.mp3')
	let jokerAtk3 = new Audio('SFX/Joker atk3.mp3')
	let jokerAbility = new Audio('SFX/Joker ability.wav')

	let pumpkinAbility = new Audio('SFX/Pumpkin ability.mp3')
	let pumpkinAtk1 = new Audio('SFX/Pumpkin atk1.wav')
	let pumpkinAtk2 = new Audio('SFX/Pumpkin atk2.wav')
	let pumpkinAtk3 = new Audio('SFX/Pumpkin atk3.mp3')

	let shellyAbility = new Audio('SFX/Shelly ability.wav')
	let shellyAtk2 = new Audio('SFX/Shelly atk2.wav')
	let shellyAtk3 = new Audio('SFX/Shelly atk3.mp3')

	let kikimamaAbility = new Audio('SFX/Kikimama atk1.mp3')
	let kikimamaAtk1 = new Audio('SFX/Kikimama atk1.mp3')
	let kikimamaAtk2 = new Audio('SFX/Kikimama atk2.mp3')
	let kikimamaAtk3 = new Audio('SFX/Kikimama atk3.mp3')

	let timeParadox = new Audio('Music/Time paradox.mp3')
	let kikimamaHasGoneTooFar = new Audio('Music/KikimamaHasGoneTooFar.mp3')
	let glitchFight = new Audio('Music/Glitch meeting.mp3')
	let fireJason = new Audio('Music/FireJason.mp3')

	timeParadox.loop = true
	glitchFight.loop = true
	fireJason.loop = true
	kikimamaHasGoneTooFar.loop = true

	const skinsContainer = $('#charactersSkins')

	let yourImg = document.getElementById('yourCharacterImg')
	let enemyImg = document.getElementById('enemyCharacterImg')

	whatSelect = 'character'

	let gameMode = null

	cardSrc = null
	cSrc = null

	eCardSrc = null
	eSrc = null

	characterCardSrc = null
	characterSrc = null

	let currentSkin = null
	let originalSkin = null

	const htmlKikimama = `
        <p>KI KI MA MA, KI KI MA MA >:D</p><br>
        <b>Статистика:</b><br><p>Броня: 15<br>Оз: 115<br>Мана: 7</p><br><b>Атака 1 - поджог:</b><br>
        <p>Накладывает на противника эффект burning I на 3 хода (сила эффекта складывается до 3). Также забирает 1 ману, либо наносит 5 урона, если ее нет. Требует маны: 2</p>
        <br><b>Атака 2 - яростный удар:</b><br><p>Сносит 5 брони и наносит 20 урона. Требует маны: 3</p>
        <br><b>Атака 3 - комбо мазохиста:</b><br><p>Наносит сопернику 50% от его хп, игнорируя броню и получает 50% от нанесенного урона. Требует маны: 5</p>
        <br><b>Активная способность - пламенное усиление:</b><br><p>Усиливает следующую атаку на 20%</p>
        <br><b>Пассивная способность - неугасаемая воля:</b><br><p>Неуязвимость к огненным атакам</p>
    `

	const htmlShelly = `
        <p>Персонаж - все в одном, часто пробует что-то новое. Она может быть и доброй поддержкой, и кровожадной убийцей, и много кем еще!</p><br>
        <b>Статистика:</b><br><p>Броня: 10<br>Оз: 60<br>Мана: 8</p><br><b>Атака 1 - Веселая поддержка!</b><br>
        <p>Исцеляет себя на 8 оз и наносит сопернику 6 урона. Требует маны: 2</p>
        <br><b>Атака 2 - zip zip zip:</b><br><p>Раскрывает возможности вселенского масштаба и ломает противнику 10 брони и наносит 10 урона. Требует маны: 5</p>
        <br><b>Атака 3 - смайл фэйс:</b><br><p>Ослепляет своим позитивом соперника, наносит ему 35 урона и сносит 12 брони, а после этого исцеляет себе 5 оз. Требует маны: 6</p>
        <br><b>Активная способность - свежий раф:</b><br><p>Восстанавливает 1 ману, 1 оз и 1 броню</p>
        <br><b>Пассивная способность - поток:</b><br><p>Пока ее хп более 50 восстанавливает в ход не 1, а 2 маны</p>
    `

	const htmlJoker = `
        <p>- Вы никогда не знаете настоящую личность Шута , что был изгнан в мир иной. Монохром заставит вас дребезжать!</p><br>
        <b>Статистика:</b><br><p>Броня: 5<br>Оз: 70<br>Мана: 13</p>
        <br><b>Атака 1 - волчок свободы:</b><br><p>Сносит 10 брони, а после этого наносит 20 урона сопернику. Требует маны: 3</p>
        <br><b>Атака 2 - кегли мести:</b><br><p>Запускает в соперника от 2 до 5 кегль. 1 кегля сносит единицу брони и наносит 10 урона. Требует маны: 6</p>
        <br><b>Атака 3 - масти, масти!</b><br><p>Воспроизводит 2 случайных события из 4: исцеление (20), атака (40), увеличение максимума брони (7), поломка брони соперника (15). Требует маны: 8</p>
        <br><b>Активная способность - ловкость шута:</b><br><p>восполняет 1 ману, уклоняется от 30 % урона следующей атаки/эффекта (шанс 3% — полный уклон)</p>
        <br><b>Пассивная способность - последнее дыхание:</b><br><p>Если оз Джокера меньше 10, то весь его урон увеличивается на 60%</p>
    `

	const htmlPumpkin = `
        <p>*Зевок* Что бы такого сюда написать?</p><br>
        <b>Статистика:</b><br><p>Броня: 30<br>Оз: 80<br>Мана: 10</p>
        <br><b>Атака 1 - сверкающий глаз:</b><br><p>Чинит 7 брони и исцеляет 7 оз. Требует маны: 2</p>
        <br><b>Атака 2 - сияние морской волны:</b><br><p>Смывает 10 брони у врага, а после наносит 10 урона. Требует маны: 4</p>
        <br><b>Атака 3 - восстановление:</b><br><p>Восполняет ману до 10, но увеличивает трату макс. энергии со способности на 1.Требует оз: 10</p>
        <br><b>Активная способность - Раскат молнии:</b><br><p>Если макс. энергии больше, чем 3, то уменьшает макс. на 1 энергию и сносит 5 брони сопернику, а после этого наносит 15 урона. Так же восполняет 1 оз</p>
    `

	const shellySkins = `
        <img src="Cards/Shelly card.png" class="skin cardAnim" data-model="Characters and Skins/Shelly.png">
        <img src="Cards/Shelly card (skin - Gnurpi).png" class="skin cardAnim" data-model="Characters and Skins/Shelly (skin - Gnurpi).png">
        <img src="Cards/Shelly card (skin - nyan).gif" class="skin cardAnim" data-model="Characters and Skins/Shelly (skin - nyan).gif">
    `

	const KikimamaSkins = `
        <img src="Cards/Kikimama card.png" class="skin cardAnim" data-model="Characters and Skins/Kikimama.png">
        <img src="Cards/Kikimama card (skin - water).png" class="skin cardAnim" data-model="Characters and Skins/Kikimama (skin - water).png">
        <img src="Cards/Kikimama card (skin - newYear).png" class="skin cardAnim" data-model="Characters and Skins/Kikimama (skin - newYear).png">
    `

	const jokerSkins = `
        <img src="Cards/Joker card.png" class="skin cardAnim" data-model="Characters and Skins/Joker.png">
        <img src="Cards/Joker card (skin - Jevil).png" class="skin cardAnim" data-model="Characters and Skins/Joker (skin - Jevil).png">
        <img src="Cards/Joker card (skin - glitch).png" class="skin cardAnim" data-model="Characters and Skins/Joker (skin - glitch).gif">
    `

	const pumpkinSkins = `
        <img src="Cards/Pumpkin card.png" class="skin cardAnim" data-model="Characters and Skins/Pumpkin.png">
        <img src="Cards/Pumpkin card (skin - glitch).gif" class="skin cardAnim" data-model="Characters and Skins/Pumpkin (skin - glitch).gif">
        <img src="Cards/Pumpkin card (skin - grayscale).png" class="skin cardAnim" data-model="Characters and Skins/Pumpkin (skin - grayscale).png">
    `

	function hoverImg(img, newSrc, html, skins, col, model) {
		img.onclick = null;

		img.addEventListener('click', () => {
			$('#charactersInfo').html(html)
			$('#charactersInfo').css('background', col)

			$('#charactersSkins').html(skins)
			$('#charactersSkins').css('background', col)
			if (whatSelect == 'character') {
				$('.character').css('filter', 'brightness(0.5)')
				const shelly = document.getElementById('shelly')
				const kikimama = document.getElementById('kikimama')
				const pumpkin = document.getElementById('pumpkin')
				const joker = document.getElementById('joker')

				shelly.src = 'Cards/Shelly card.png'
				kikimama.src = 'Cards/Kikimama card.png'
				pumpkin.src = 'Cards/Pumpkin card.png'
				joker.src = 'Cards/Joker card.png'

				$(img).css('filter', 'brightness(1.0)')

				originalSrc = img.src
				cardSrc = originalSrc
				img.src = newSrc
				cSrc = model
			} else if (whatSelect == 'enemy') {
				$('.character').css('filter', 'brightness(0.5)')
				const shelly = document.getElementById('shelly')
				const kikimama = document.getElementById('kikimama')
				const pumpkin = document.getElementById('pumpkin')
				const joker = document.getElementById('joker')

				shelly.src = 'Cards/Shelly card.png'
				kikimama.src = 'Cards/Kikimama card.png'
				pumpkin.src = 'Cards/Pumpkin card.png'
				joker.src = 'Cards/Joker card.png'

				$(img).css('filter', 'brightness(1.0)')

				originalSrc = img.src
				eCardSrc = originalSrc
				img.src = newSrc
				eSrc = model
			}
		})


		skinsContainer.on('click', '.skin', function () {
			const skinModel = $(this).data('model')
			const skinCard = this.src

			if (skinModel) {
				if (whatSelect === 'character') {
					characterCardSrc = skinCard
					characterSrc = skinModel

					$('#heading').text('Выбери своего врага')
					yourImg.src = skinModel
					defaultPlayerSrc = skinModel

					setTimeout(() => {
						whatSelect = 'enemy'
					}, 1)
				} else if (whatSelect === 'enemy') {
					eSrc = skinModel
					eCardSrc = skinCard

					enemyImg.src = skinModel
					defaultEnemySrc = skinModel

					if (cSrc && eSrc) {
						whatSelect = 'modifiers'
						$('#selectCharacterMenu').css('display', 'none')
						$('#selectModifiersMenu').css('display', 'block')
					}
				}
		}
	})
}

	$('#startGame').click(() => start())

	hoverImg(
		characters[0],
		'Cards/GIFs/Joker card gif.gif',
		htmlJoker,
		jokerSkins,
		'#444444',
		'Characters and Skins/Joker.png'
	)
	hoverImg(
		characters[1],
		'Cards/GIFs/Kikimama card gif.gif',
		htmlKikimama,
		KikimamaSkins,
		'#41312bff',
		'Characters and Skins/Kikimama.png'
	)
	hoverImg(
		characters[2],
		'Cards/GIFs/Pumpkin card gif.gif',
		htmlPumpkin,
		pumpkinSkins,
		'#243531',
		'Characters and Skins/Pumpkin.png'
	)
	hoverImg(
		characters[3],
		'Cards/GIFs/Shelly card gif.gif',
		htmlShelly,
		shellySkins,
		'#352e24ff',
		'Characters and Skins/Shelly.png'
	)

	$('#play').click(() => {
		$('#startMenu').css('display', 'none')
		$('#gameModeMenu').css('display', 'grid')
	})

	$('#PvE').click(() => {
		gameMode = 'pve'
		$('#gameModeInfo').text(
			'Самый классический режим. Сразись с ботом и отвлекись от всего (это приказ)'
		)
		$('#start').css('opacity', '1')
	})

	$('#PvP').click(() => {
		gameMode = 'pvp'
		$('#gameModeInfo').text('Скоро...')
		$('#start').css('opacity', '0')
	})

	$('#start').click(() => {
		$('#gameModeMenu').css('display', 'none')
		$('#selectCharacterMenu').css('display', 'grid')
	})

	$('#skinsButton').click(() => {
		$('#skinsButton').css('filter', 'brightness(1.0) blur(0)')
		$('#charactersInfoButton').css('filter', 'brightness(0.7) blur(1px)')
		$('#charactersInfo').css('display', 'none')
		$('#charactersSkins').css('display', 'grid')
	})

	$('#charactersInfoButton').click(() => {
		if (originalSkin) {
			yourImg.src = originalSkin
			currentSkin = null

			$('.skin').css('filter', 'brightness(0.8)')
		}

		$('#skinsButton').css('filter', 'brightness(0.7) blur(1px)')
		$('#charactersInfoButton').css('filter', 'brightness(1) blur(0)')
		$('#charactersInfo').css('display', 'block')
		$('#charactersSkins').css('display', 'none')
	})

	$('#achievements').click(() => {
		const rootStyles = getComputedStyle(document.documentElement);
		const display = rootStyles.getPropertyValue('--flex-or-grid');
		$('#startMenu').css('display', 'none')
		$('#achievementsMenu').css('display', 'grid')
		setSrcAch()
	})

	$('#stats').click(() => {
		$('#startMenu').css('display', 'none')
		$('#statsMenu').css('display', 'grid')
		setStats()
	})

	$('.exit').click(() => {
		$('#startMenu').css('display', 'grid')
		$('#achievementsMenu').css('display', 'none')
		$('#statsMenu').css('display', 'none')
	})

	$('#reset').click(() => {
		if (confirm('Вы уверены, что хотите сбросить ВЕСЬ прогресс?')) {
			localStorage.clear()
			window.location.reload()
		}
	})

	skinsContainer.find('.skin').click(event => {
		const skinImg = event.target
		const skinModel = skinImg.dataset.model

		if (skinModel) {
			yourImg.src = skinModel
			currentSkin = skinModel
		}
	})


	function turnOffButtons() {
		$(attack1Img).off('click')
		$(attack2Img).off('click')
		$(attack3Img).off('click')
		$(ability).off('click')
		$(ritualImg).off('click')
		$('#useButton').off('click')

		if (mobile) {
			$(attack1Img).on('click', () => {
				$('#attackInfo').html(player.atk1Html)
				$('#selectedAttack').text('Атака 1')
				selectedAttack = 1
			})

			$(attack2Img).on('click', () => {
				$('#attackInfo').html(player.atk2Html)
				$('#selectedAttack').text('Атака 2')
				selectedAttack = 2
			})

			$(attack3Img).on('click', () => {
				$('#attackInfo').html(player.atk3Html)
				$('#selectedAttack').text('Атака 3')
				selectedAttack = 3
			})

			$(ability).on('click', () => {
				$('#attackInfo').html(player.abilityHtml)
				$('#selectedAttack').text('Способность')
				selectedAttack = 'ability'
			})

			$(ritualImg).on('click', () => {
				$('#attackInfo').html(ritualHtml)
				$('#selectedAttack').text('Ритуал')
				selectedAttack = 'ritual'
			})
		}
	}

	async function yourTurn() {
		if (!gameRunning || isDied) return
		if (modifiers.heal.isOn) {
			player.heal(+modifiers.heal.Quantity, true)
		}
		restoredMana = false
		player.updateEffects()
		yourImg.src = defaultPlayerSrc
		enemyImg.src = defaultEnemySrc

		checkPlayerHp()
		checkEnemyHp()

		turn = "you"
		return new Promise(resolve => {
			$('#turn').text('Твой ход')

			// Восстановление маны
			if (modifiers.cheerfulness.isOn) {
				if (!restoredMana) {
					restoredMana = true
					if (player.mana != player.maxMana) {
						if (player.Character === "Shelly" && player.hp > 50) {
							player.restoreMana(2 + +modifiers.cheerfulness.manaBoost)
						} else {
							player.restoreMana(1 + +modifiers.cheerfulness.manaBoost)
						}
					}
				}
			} else {
				if (!restoredMana) {
					if (player.mana != player.maxMana) {
						if (player.Character === "Shelly" && player.hp > 50) {
							player.restoreMana(2)
						} else {
							player.restoreMana(1)
						}
						if (player.mana > player.maxMana) {
							player.mana = player.maxMana
						}
					}
				}
			}

			player.updateUI()
			player.pasteAttacksSrc()

			// Обработчики кликов

			if (!mobile) {
				$(attack1Img).on('click', () => {
					if (player.mana >= player.attack1Mana) {
						if (!attack1Used) {
							playerSteps += 1
							console.log(playerSteps)
							turnOffButtons()
							player.specialAttack1()
							attack1Used = true
							setTimeout(() => {
								enemyTurn()
							}, 1000)
						}
					}
				})

				$(attack2Img).on('click', () => {
					if (player.mana >= player.attack2Mana) {
						if (!attack2Used) {
							playerSteps += 1
							console.log(playerSteps)
							turnOffButtons()
							player.specialAttack2()
							attack2Used = true
							setTimeout(() => {
								enemyTurn()
							}, 1000)
						}
					}
				})

				$(attack3Img).on('click', () => {
					if (player.mana >= player.attack3Mana) {
						if (!attack3Used) {
							playerSteps += 1
							console.log(playerSteps)
							turnOffButtons()
							player.specialAttack3()
							attack3Used = true
							setTimeout(() => {
								enemyTurn()
							}, 1000)
						}
					}
				})

				$(ability).on('click', () => {
					if (!abilityUsed) {
						playerSteps += 1
						console.log(playerSteps)
						turnOffButtons()
						player.specialAbility()
						abilityUsed = true
						setTimeout(() => {
							enemyTurn()
						}, 1000)
					}
				})

				$(ritualImg).on('click', () => {
					if (!ritualUsed) {
						playerSteps += 1
						console.log(playerSteps)
						turnOffButtons()
						player.ritual()
						ritualUsed = true
						setTimeout(() => {
							enemyTurn()
						}, 1000)
					}
				}) 
			} else {
				$(attack1Img).on('click', () => {
					$('#attackInfo').html(player.atk1Html)
					$('#selectedAttack').text('Атака 1')
					selectedAttack = 1
				})

				$(attack2Img).on('click', () => {
					$('#attackInfo').html(player.atk2Html)
					$('#selectedAttack').text('Атака 2')
					selectedAttack = 2
				})

				$(attack3Img).on('click', () => {
					$('#attackInfo').html(player.atk3Html)
					$('#selectedAttack').text('Атака 3')
					selectedAttack = 3
				})

				$(ability).on('click', () => {
					$('#attackInfo').html(player.abilityHtml)
					$('#selectedAttack').text('Способность')
					selectedAttack = 'ability'
				})

				$(ritualImg).on('click', () => {
					$('#attackInfo').html(ritualHtml)
					$('#selectedAttack').text('Ритуал')
					selectedAttack = 'ritual'
				})

				$('#useButton').on('click', () => {
					if (selectedAttack) {
						switch (selectedAttack) {
							case 1:
								if (player.mana >= player.attack1Mana) {
									if (!attack1Used) {
										playerSteps += 1
										console.log(playerSteps)
										turnOffButtons()
										player.specialAttack1()
										attack1Used = true
										setTimeout(() => {
											enemyTurn()
										}, 1000)
									}
								}
								break
							case 2:
								if (player.mana >= player.attack2Mana) {
									if (!attack2Used) {
										playerSteps += 1
										console.log(playerSteps)
										turnOffButtons()
										player.specialAttack2()
										attack2Used = true
										setTimeout(() => {
											enemyTurn()
										}, 1000)
									}
								}
								break
							case 3:
								if (player.mana >= player.attack3Mana) {
									if (!attack3Used) {
										playerSteps += 1
										console.log(playerSteps)
										turnOffButtons()
										player.specialAttack3()
										attack3Used = true
										setTimeout(() => {
											enemyTurn()
										}, 1000)
									}
								}
								break
							case 'ability':
								if (!abilityUsed) {
									playerSteps += 1
									console.log(playerSteps)
									turnOffButtons()
									player.specialAbility()
									abilityUsed = true
									setTimeout(() => {
										enemyTurn()
									}, 1000)
								}
								break
							case 'ritual':
								if (!ritualUsed) {
									playerSteps += 1
									console.log(playerSteps)
									turnOffButtons()
									player.ritual()
									ritualUsed = true
									setTimeout(() => {
										enemyTurn()
									}, 1000)
								}
								break
						}
					}
				})
			}
		})
	}

	async function enemyTurn() {
		if (!gameRunning || isDied) return
		if (modifiers.heal.isOn) {
			enemy.heal(+modifiers.heal.Quantity)
		}
		restoredMana = false
		enemy.updateEffects()
		yourImg.src = defaultPlayerSrc
		enemyImg.src = defaultEnemySrc

		checkEnemyHp()
		checkPlayerHp()

		turn = "enemy"
		$('#turn').text('Ход соперника')
		turnOffButtons()
		return new Promise(async resolve => {
			setTimeout(() => {
				if (enemy.hp != enemy.maxHp) {
					isPacifist = false
				}
				// Восстановление маны
				if (modifiers.cheerfulness.isOn) {
					if (!restoredMana) {
						restoredMana = true
						if (enemy.mana != enemy.maxMana) {
							if (enemy.Character === "Shelly" && enemy.hp > 50) {
								enemy.restoreMana(2 + +modifiers.cheerfulness.manaBoost)
							} else {
								enemy.restoreMana(1 + +modifiers.cheerfulness.manaBoost)
							}
						}
					}
				} else {
					if (!restoredMana) {
						if (enemy.mana != enemy.maxMana) {
							if (enemy.Character === "Shelly" && enemy.hp > 50) {
								enemy.restoreMana(2)
							} else {
								enemy.restoreMana(1)
							}
							if (enemy.mana > enemy.maxMana) {
								enemy.mana = enemy.maxMana
							}
						}
					}
				}

				setTimeout(() => {
					enemy.BotAttack()
					enemy.updateUI()
				}, 300)

				checkPlayerHp()

				abilityUsed = false
				attack1Used = false
				attack2Used = false
				attack3Used = false
				ritualUsed = false
				resolve()
				setTimeout(() => {
					yourTurn()
				}, 1300)
			}, 500)
		})
	}

	let gameRunning = false;
	let currentGamePromise = null;

	async function startGame() {
		isDied = false
		gameRunning = true
		currentGamePromise = (async () => {
			while (!isDied && gameRunning) {
				await yourTurn();
				if (!gameRunning || isDied) break;
				await enemyTurn();
			}
		})()
		await currentGamePromise;
	}

	function stopGame() {
		gameRunning = false;
		if (currentGamePromise) {
			currentGamePromise = null;
		}
		
		turnOffButtons()
		
		const maxId = setTimeout(() => {}, 0);
		for (let i = maxId; i >= 0; i--) {
			clearTimeout(i);
			clearInterval(i);
		}
		
		isDied = true
		turn = 'you'
	}
})

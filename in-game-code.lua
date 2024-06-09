local apiEndpoint = "http://localhost:3000/v1/api/joinlogs"

local function sendLogToAPI(playerName, action)
	local HttpService = game:GetService("HttpService")

	local data = {
		player = playerName,
		action = action,
		timestamp = os.time()
	}

	local jsonData = HttpService:JSONEncode(data)

	local headers = {
		["Content-Type"] = "application/json"
	}

	local requestParams = {
		Url = apiEndpoint,
		Method = "POST",
		Headers = headers,
		Body = jsonData
	}

	local success, response = pcall(function()
		return HttpService:RequestAsync(requestParams)
	end)

	if success then
		print("Log sent successfully: " .. response.StatusCode)
	else
		warn("Failed to send log: " .. response)
	end
end

game.Players.PlayerAdded:Connect(function(player)
	print(player.Name .. " has joined the game.")
	sendLogToAPI(player.Name, "join")
end)

game.Players.PlayerRemoving:Connect(function(player)
	print(player.Name .. " has left the game.")
	sendLogToAPI(player.Name, "leave")
end)
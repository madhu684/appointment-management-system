FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["src/AMS.API/AMS.API.csproj", "src/AMS.API/"]
COPY ["src/AMS.Application/AMS.Application.csproj", "src/AMS.Application/"]
COPY ["src/AMS.Infrastructure/AMS.Infrastructure.csproj", "src/AMS.Infrastructure/"]
COPY ["src/AMS.Domain/AMS.Domain.csproj", "src/AMS.Domain/"]
RUN dotnet restore "src/AMS.API/AMS.API.csproj"
COPY . .
WORKDIR "/src/src/AMS.API"
RUN dotnet publish "AMS.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AMS.API.dll"]

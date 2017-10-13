local __exports = LibStub:NewLibrary("tsaddon", 10000)
if not __exports then return end
local __class = LibStub:GetLibrary("tslib").newClass
local CreateFrame = CreateFrame
local ipairs = ipairs
local tinsert = table.insert
__exports.vide = function()
end
__exports.NewAddon = function(name, dep1, dep2)
    local BaseClass = __class(nil, {
        constructor = function(self, args)
            self.modules = {}
            local frame = CreateFrame("Frame", "tslibframe")
            frame:RegisterEvent("ADDON_LOADED")
            frame:SetScript("OnEvent", function(self, event, addon)
                if addon ~= name then
                    return 
                end
                for _, module in ipairs(self.modules) do
                    if module.OnInitialize then
                        module:OnInitialize()
                    end
                end
            end)
        end,
        NewModule = function(self, name, dep1, dep2, dep3, dep4)
            local addon = self
            local BaseModule = __class(nil, {
                constructor = function(self)
                    tinsert(addon.modules, self)
                end,
                GetName = function(self)
                    return name
                end,
            })
            if dep1 then
                if dep2 then
                    if dep3 then
                        if dep4 then
                            return dep1:Embed(dep2:Embed(dep3:Embed(dep4:Embed(BaseModule))))
                        end
                        return dep1:Embed(dep2:Embed(dep3:Embed(BaseModule)))
                    end
                    return dep1:Embed(dep2:Embed(BaseModule))
                end
                return dep1:Embed(BaseModule)
            end
            return BaseModule
        end,
        GetName = function(self)
            return name
        end,
    })
    if dep1 then
        if dep2 then
            return dep2:Embed(dep1:Embed(BaseClass))
        end
        return dep1:Embed(BaseClass)
    end
    return BaseClass
end
